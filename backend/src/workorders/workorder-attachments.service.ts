import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateWorkOrderAttachmentDto } from './dto/create-workorder-attachment.dto';

@Injectable()
export class WorkOrderAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async addAttachment(workOrderId: string, createAttachmentDto: CreateWorkOrderAttachmentDto, user: any) {
    // Check if work order exists and user has access
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { site: true },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    await this.checkSiteAccess(workOrder.siteId, user);

    const attachment = await this.prisma.workOrderAttachment.create({
      data: {
        workOrderId,
        url: createAttachmentDto.url,
        filename: createAttachmentDto.filename,
      },
    });

    await this.auditService.log(user.id, 'ATTACHMENT_ADDED', 'WORK_ORDER', workOrderId);

    return attachment;
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