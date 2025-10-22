import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCapitalProjectAttachmentDto } from './dto/create-capital-project-attachment.dto';

@Injectable()
export class CapitalProjectAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async addAttachment(projectId: string, createAttachmentDto: CreateCapitalProjectAttachmentDto, user: any) {
    // Check if project exists and user has access
    const project = await this.prisma.capitalProject.findUnique({
      where: { id: projectId },
      include: { site: true },
    });

    if (!project) {
      throw new NotFoundException('Capital project not found');
    }

    await this.checkSiteAccess(project.siteId, user);

    const attachment = await this.prisma.capitalProjectAttachment.create({
      data: {
        projectId,
        url: createAttachmentDto.url,
        filename: createAttachmentDto.filename,
        uploadedById: user.id,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditService.log(user.id, 'ATTACHMENT_ADDED', 'CAPITAL_PROJECT', projectId);

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