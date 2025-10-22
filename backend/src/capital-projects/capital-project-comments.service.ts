import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCapitalProjectCommentDto } from './dto/create-capital-project-comment.dto';

@Injectable()
export class CapitalProjectCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async addComment(projectId: string, createCommentDto: CreateCapitalProjectCommentDto, user: any) {
    // Check if project exists and user has access
    const project = await this.prisma.capitalProject.findUnique({
      where: { id: projectId },
      include: { site: true },
    });

    if (!project) {
      throw new NotFoundException('Capital project not found');
    }

    await this.checkSiteAccess(project.siteId, user);

    const comment = await this.prisma.capitalProjectComment.create({
      data: {
        projectId,
        userId: user.id,
        message: createCommentDto.message,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await this.auditService.log(user.id, 'COMMENT_ADDED', 'CAPITAL_PROJECT', projectId);

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