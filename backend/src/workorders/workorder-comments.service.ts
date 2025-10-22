import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateWorkOrderCommentDto } from './dto/create-workorder-comment.dto';

@Injectable()
export class WorkOrderCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async addComment(workOrderId: string, createCommentDto: CreateWorkOrderCommentDto, user: any) {
    // Check if work order exists and user has access
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { site: true },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    await this.checkSiteAccess(workOrder.siteId, user);

    const comment = await this.prisma.workOrderComment.create({
      data: {
        workOrderId,
        userId: user.id,
        message: createCommentDto.message,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditService.log(user.id, 'COMMENT_ADDED', 'WORK_ORDER', workOrderId);

    return comment;
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