import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createBuildingDto: CreateBuildingDto, user: any) {
    await this.checkSiteAccess(createBuildingDto.siteId, user);

    const building = await this.prisma.building.create({
      data: createBuildingDto,
      include: {
        site: true,
      },
    });

    await this.auditService.log(user.id, 'CREATE', 'BUILDING', building.id);

    return building;
  }

  async findAll(user: any) {
    const siteIds = this.getUserSiteIds(user);
    
    if (siteIds.length > 0) {
      return this.prisma.building.findMany({
        where: {
          siteId: { in: siteIds },
        },
        include: {
          site: true,
          areas: {
            include: {
              assets: true,
            },
          },
        },
      });
    }

    return this.prisma.building.findMany({
      include: {
        site: true,
        areas: {
          include: {
            assets: true,
          },
        },
      },
    });
  }

  async findOne(id: string, user: any) {
    const building = await this.prisma.building.findUnique({
      where: { id },
      include: {
        site: true,
        areas: {
          include: {
            assets: true,
          },
        },
      },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    await this.checkSiteAccess(building.siteId, user);

    return building;
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto, user: any) {
    const building = await this.findOne(id, user);

    const updatedBuilding = await this.prisma.building.update({
      where: { id },
      data: updateBuildingDto,
      include: {
        site: true,
      },
    });

    await this.auditService.log(user.id, 'UPDATE', 'BUILDING', building.id);

    return updatedBuilding;
  }

  async remove(id: string, userId: string) {
    const building = await this.prisma.building.findUnique({
      where: { id },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    await this.prisma.building.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'BUILDING', id);

    return { message: 'Building deleted successfully' };
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