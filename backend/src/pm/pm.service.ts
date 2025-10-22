import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateMaintenanceTemplateDto } from './dto/create-maintenance-template.dto';
import { UpdateMaintenanceTemplateDto } from './dto/update-maintenance-template.dto';

@Injectable()
export class PMService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createTemplate(createTemplateDto: CreateMaintenanceTemplateDto, user: any) {
    // Check site access
    await this.checkSiteAccess(createTemplateDto.siteId, user);

    const template = await this.prisma.maintenanceTemplate.create({
      data: createTemplateDto,
      include: {
        site: true,
        area: true,
        asset: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditService.log(user.id, 'CREATE', 'MAINTENANCE_TEMPLATE', template.id);

    // Generate initial occurrences for the next 6 months
    await this.generateOccurrences(template.id);

    return template;
  }

  async getTemplates(user: any) {
    const siteIds = this.getUserSiteIds(user);
    
    const where: any = {};
    if (siteIds.length > 0) {
      where.siteId = { in: siteIds };
    }

    return this.prisma.maintenanceTemplate.findMany({
      where,
      include: {
        site: true,
        area: true,
        asset: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            occurrences: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTemplate(id: string, user: any) {
    const template = await this.prisma.maintenanceTemplate.findUnique({
      where: { id },
      include: {
        site: true,
        area: true,
        asset: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        occurrences: {
          include: {
            generatedWorkOrder: true,
          },
          orderBy: {
            scheduledDate: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Maintenance template not found');
    }

    await this.checkSiteAccess(template.siteId, user);

    return template;
  }

  async getTemplateOccurrences(id: string, user: any) {
    const template = await this.prisma.maintenanceTemplate.findUnique({
      where: { id },
      select: { siteId: true },
    });

    if (!template) {
      throw new NotFoundException('Maintenance template not found');
    }

    await this.checkSiteAccess(template.siteId, user);

    return this.prisma.maintenanceOccurrence.findMany({
      where: { templateId: id },
      include: {
        template: {
          include: {
            site: true,
            area: true,
            asset: true,
          },
        },
        generatedWorkOrder: true,
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });
  }

  async updateTemplate(id: string, updateTemplateDto: UpdateMaintenanceTemplateDto, user: any) {
    const existingTemplate = await this.getTemplate(id, user);

    const template = await this.prisma.maintenanceTemplate.update({
      where: { id },
      data: updateTemplateDto,
      include: {
        site: true,
        area: true,
        asset: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditService.log(user.id, 'UPDATE', 'MAINTENANCE_TEMPLATE', template.id);

    // If frequency changed, regenerate future occurrences
    if (updateTemplateDto.frequency && updateTemplateDto.frequency !== existingTemplate.frequency) {
      await this.regenerateOccurrences(template.id);
    }

    return template;
  }

  async deleteTemplate(id: string, userId: string) {
    const template = await this.prisma.maintenanceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Maintenance template not found');
    }

    await this.prisma.maintenanceTemplate.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'MAINTENANCE_TEMPLATE', id);

    return { message: 'Maintenance template deleted successfully' };
  }

  async skipOccurrence(id: string, user: any) {
    const occurrence = await this.prisma.maintenanceOccurrence.findUnique({
      where: { id },
      include: {
        template: true,
      },
    });

    if (!occurrence) {
      throw new NotFoundException('Maintenance occurrence not found');
    }

    await this.checkSiteAccess(occurrence.template.siteId, user);

    if (occurrence.status !== 'PENDING') {
      throw new ForbiddenException('Can only skip pending occurrences');
    }

    const updatedOccurrence = await this.prisma.maintenanceOccurrence.update({
      where: { id },
      data: { status: 'SKIPPED' },
      include: {
        template: {
          include: {
            site: true,
            area: true,
            asset: true,
          },
        },
      },
    });

    await this.auditService.log(user.id, 'SKIP', 'MAINTENANCE_OCCURRENCE', id);

    return updatedOccurrence;
  }

  async getCalendar(user: any, startDate?: string, endDate?: string) {
    const siteIds = this.getUserSiteIds(user);
    
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days from now

    const where: any = {
      scheduledDate: {
        gte: start,
        lte: end,
      },
    };

    if (siteIds.length > 0) {
      where.template = {
        siteId: { in: siteIds },
      };
    }

    return this.prisma.maintenanceOccurrence.findMany({
      where,
      include: {
        template: {
          include: {
            site: true,
            area: true,
            asset: true,
            assignedTo: { select: { id: true, name: true, email: true } },
          },
        },
        generatedWorkOrder: true,
      },
      orderBy: {
        scheduledDate: 'asc',
      },
    });
  }

  async generateOccurrences(templateId: string) {
    const template = await this.prisma.maintenanceTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) return;

    const now = new Date();
    const endDate = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000); // 6 months from now
    const occurrences = [];

    let currentDate = new Date(now);
    
    while (currentDate <= endDate) {
      const nextDate = this.getNextScheduledDate(currentDate, template.frequency);
      
      if (nextDate <= endDate) {
        occurrences.push({
          templateId: template.id,
          scheduledDate: nextDate,
          status: 'PENDING' as const,
        });
      }
      
      currentDate = nextDate;
    }

    if (occurrences.length > 0) {
      await this.prisma.maintenanceOccurrence.createMany({
        data: occurrences,
        skipDuplicates: true,
      });
    }
  }

  async regenerateOccurrences(templateId: string) {
    // Delete future pending occurrences
    await this.prisma.maintenanceOccurrence.deleteMany({
      where: {
        templateId,
        status: 'PENDING',
        scheduledDate: {
          gte: new Date(),
        },
      },
    });

    // Generate new occurrences
    await this.generateOccurrences(templateId);
  }

  private getNextScheduledDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);
    
    switch (frequency) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'QUARTERLY':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'SEMI_ANNUAL':
        next.setMonth(next.getMonth() + 6);
        break;
      case 'ANNUAL':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        next.setMonth(next.getMonth() + 1);
    }
    
    return next;
  }

  private getUserSiteIds(user: any): string[] {
    if (!user.roles) return [];
    
    return user.roles
      .filter((role: any) => role.siteId)
      .map((role: any) => role.siteId);
  }

  private async checkSiteAccess(siteId: string, user: any) {
    const userSiteIds = this.getUserSiteIds(user);
    
    if (userSiteIds.length > 0 && !userSiteIds.includes(siteId)) {
      throw new ForbiddenException('Access denied to this site');
    }
  }
}