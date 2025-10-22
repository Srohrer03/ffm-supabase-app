import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PMSchedulerService } from '../pm/pm-scheduler.service';
import { CreateWorkOrderDto } from './dto/create-workorder.dto';
import { UpdateWorkOrderDto } from './dto/update-workorder.dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly pmSchedulerService: PMSchedulerService,
  ) {}

  async create(createWorkOrderDto: CreateWorkOrderDto, user: any) {
    // Check site access
    await this.checkSiteAccess(createWorkOrderDto.siteId, user);

    const workOrder = await this.prisma.workOrder.create({
      data: {
        ...createWorkOrderDto,
        requesterId: user.id,
      },
      include: {
        site: true,
        area: true,
        asset: true,
        requester: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
      },
    });

    await this.auditService.log(user.id, 'CREATE', 'WORK_ORDER', workOrder.id);

    return workOrder;
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
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.siteId) {
      where.siteId = filters.siteId;
    }

    return this.prisma.workOrder.findMany({
      where,
      include: {
        site: true,
        area: true,
        asset: true,
        requester: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
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
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
      include: {
        site: true,
        area: true,
        asset: true,
        requester: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
      },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    await this.checkSiteAccess(workOrder.siteId, user);

    return workOrder;
  }

  async update(id: string, updateWorkOrderDto: UpdateWorkOrderDto, user: any) {
    const existingWorkOrder = await this.findOne(id, user);

    // Check permissions for different update types
    const userRoles = user.roles?.map((r: any) => r.name) || [];
    
    // Only ADMIN/FM can assign work orders
    if (updateWorkOrderDto.assignedToId && 
        !userRoles.some((role: string) => ['ADMIN', 'FM'].includes(role))) {
      throw new ForbiddenException('Only ADMIN or FM can assign work orders');
    }

    const workOrder = await this.prisma.workOrder.update({
      where: { id },
      data: {
        ...updateWorkOrderDto,
        completedAt: updateWorkOrderDto.status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        site: true,
        area: true,
        asset: true,
        requester: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
      },
    });

    // Handle PM completion if work order is completed
    if (updateWorkOrderDto.status === 'COMPLETED' && existingWorkOrder.status !== 'COMPLETED') {
      await this.pmSchedulerService.handleWorkOrderCompletion(workOrder.id);
    }

    // Log status changes
    if (updateWorkOrderDto.status && updateWorkOrderDto.status !== existingWorkOrder.status) {
      await this.auditService.log(
        user.id,
        'STATUS_CHANGE',
        'WORK_ORDER',
        workOrder.id,
      );
    }

    // Log assignment changes
    if (updateWorkOrderDto.assignedToId && updateWorkOrderDto.assignedToId !== existingWorkOrder.assignedToId) {
      await this.auditService.log(
        user.id,
        'ASSIGNMENT_CHANGE',
        'WORK_ORDER',
        workOrder.id,
      );
    }

    await this.auditService.log(user.id, 'UPDATE', 'WORK_ORDER', workOrder.id);

    return workOrder;
  }

  async remove(id: string, userId: string) {
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    await this.prisma.workOrder.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'WORK_ORDER', id);

    return { message: 'Work order deleted successfully' };
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