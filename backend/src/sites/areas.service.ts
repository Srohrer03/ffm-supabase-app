import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createAreaDto: CreateAreaDto, user: any) {
    // Check if user has access to the building's site
    const building = await this.prisma.building.findUnique({
      where: { id: createAreaDto.buildingId },
      include: { site: true },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    await this.checkSiteAccess(building.siteId, user);

    const area = await this.prisma.area.create({
      data: createAreaDto,
      include: {
        building: {
          include: {
            site: true,
          },
        },
      },
    });

    await this.auditService.log(user.id, 'CREATE', 'AREA', area.id);

    return area;
  }

  async findAll(user: any) {
    const siteIds = this.getUserSiteIds(user);
    
    if (siteIds.length > 0) {
      return this.prisma.area.findMany({
        where: {
          building: {
            siteId: { in: siteIds },
          },
        },
        include: {
          building: {
            include: {
              site: true,
            },
          },
          assets: true,
        },
      });
    }

    return this.prisma.area.findMany({
      include: {
        building: {
          include: {
            site: true,
          },
        },
        assets: true,
      },
    });
  }

  async findOne(id: string, user: any) {
    const area = await this.prisma.area.findUnique({
      where: { id },
      include: {
        building: {
          include: {
            site: true,
          },
        },
        assets: true,
      },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    await this.checkSiteAccess(area.building.siteId, user);

    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto, user: any) {
    const area = await this.findOne(id, user);

    const updatedArea = await this.prisma.area.update({
      where: { id },
      data: updateAreaDto,
      include: {
        building: {
          include: {
            site: true,
          },
        },
      },
    });

    await this.auditService.log(user.id, 'UPDATE', 'AREA', area.id);

    return updatedArea;
  }

  async remove(id: string, userId: string) {
    const area = await this.prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    await this.prisma.area.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'AREA', id);

    return { message: 'Area deleted successfully' };
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