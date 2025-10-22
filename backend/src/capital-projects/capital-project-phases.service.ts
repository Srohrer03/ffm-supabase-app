import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCapitalProjectPhaseDto } from './dto/create-capital-project-phase.dto';
import { UpdateCapitalProjectPhaseDto } from './dto/update-capital-project-phase.dto';

@Injectable()
export class CapitalProjectPhasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async addPhase(projectId: string, createPhaseDto: CreateCapitalProjectPhaseDto, user: any) {
    // Check if project exists and user has access
    const project = await this.prisma.capitalProject.findUnique({
      where: { id: projectId },
      include: { site: true },
    });

    if (!project) {
      throw new NotFoundException('Capital project not found');
    }

    await this.checkSiteAccess(project.siteId, user);

    const phase = await this.prisma.capitalProjectPhase.create({
      data: {
        projectId,
        ...createPhaseDto,
      },
      include: {
        project: {
          include: {
            site: true,
          },
        },
      },
    });

    await this.auditService.log(user.id, 'PHASE_ADDED', 'CAPITAL_PROJECT', projectId);

    return phase;
  }

  async updatePhase(id: string, updatePhaseDto: UpdateCapitalProjectPhaseDto, user: any) {
    const phase = await this.prisma.capitalProjectPhase.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            site: true,
          },
        },
      },
    });

    if (!phase) {
      throw new NotFoundException('Capital project phase not found');
    }

    await this.checkSiteAccess(phase.project.siteId, user);

    const updatedPhase = await this.prisma.capitalProjectPhase.update({
      where: { id },
      data: updatePhaseDto,
      include: {
        project: {
          include: {
            site: true,
          },
        },
      },
    });

    await this.auditService.log(user.id, 'PHASE_UPDATED', 'CAPITAL_PROJECT_PHASE', id);

    return updatedPhase;
  }

  async removePhase(id: string, userId: string) {
    const phase = await this.prisma.capitalProjectPhase.findUnique({
      where: { id },
    });

    if (!phase) {
      throw new NotFoundException('Capital project phase not found');
    }

    await this.prisma.capitalProjectPhase.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'PHASE_DELETED', 'CAPITAL_PROJECT_PHASE', id);

    return { message: 'Capital project phase deleted successfully' };
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