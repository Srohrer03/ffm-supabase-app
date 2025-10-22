import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCapitalProjectDto } from './dto/create-capital-project.dto';
import { UpdateCapitalProjectDto } from './dto/update-capital-project.dto';

@Injectable()
export class CapitalProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createCapitalProjectDto: CreateCapitalProjectDto, user: any) {
    await this.checkSiteAccess(createCapitalProjectDto.siteId, user);

    const project = await this.prisma.capitalProject.create({
      data: {
        ...createCapitalProjectDto,
        createdById: user.id,
      },
      include: {
        site: true,
        createdBy: { select: { id: true, name: true, email: true } },
        phases: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            uploadedBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            phases: true,
            comments: true,
            attachments: true,
          },
        },
      },
    });

    await this.auditService.log(user.id, 'CREATE', 'CAPITAL_PROJECT', project.id);

    return project;
  }

  async findAll(user: any, filters: any = {}) {
    const siteIds = this.getUserSiteIds(user);
    
    const where: any = {};

    // Apply site-scoped access
    if (siteIds.length > 0) {
      where.siteId = { in: siteIds };
    }

    // Apply filters
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.siteId) {
      where.siteId = filters.siteId;
    }

    return this.prisma.capitalProject.findMany({
      where,
      include: {
        site: true,
        createdBy: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            phases: true,
            comments: true,
            attachments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, user: any) {
    const project = await this.prisma.capitalProject.findUnique({
      where: { id },
      include: {
        site: true,
        createdBy: { select: { id: true, name: true, email: true } },
        phases: {
          orderBy: { createdAt: 'asc' },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            uploadedBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Capital project not found');
    }

    await this.checkSiteAccess(project.siteId, user);

    return project;
  }

  async update(id: string, updateCapitalProjectDto: UpdateCapitalProjectDto, user: any) {
    const existingProject = await this.findOne(id, user);

    const project = await this.prisma.capitalProject.update({
      where: { id },
      data: updateCapitalProjectDto,
      include: {
        site: true,
        createdBy: { select: { id: true, name: true, email: true } },
        phases: true,
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            uploadedBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    await this.auditService.log(user.id, 'UPDATE', 'CAPITAL_PROJECT', project.id);

    return project;
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.capitalProject.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Capital project not found');
    }

    await this.prisma.capitalProject.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'CAPITAL_PROJECT', id);

    return { message: 'Capital project deleted successfully' };
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