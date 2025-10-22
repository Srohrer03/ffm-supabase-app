import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createAssetDto: CreateAssetDto, user: any) {
    // Check if user has access to the area's site
    const area = await this.prisma.area.findUnique({
      where: { id: createAssetDto.areaId },
      include: {
        building: {
          include: {
            site: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    await this.checkSiteAccess(area.building.siteId, user);

    const asset = await this.prisma.asset.create({
      data: createAssetDto,
      include: {
        area: {
          include: {
            building: {
              include: {
                site: true,
              },
            },
          },
        },
      },
    });

    await this.auditService.log(user.id, 'CREATE', 'ASSET', asset.id);

    return asset;
  }

  async findAll(user: any) {
    const siteIds = this.getUserSiteIds(user);
    
    if (siteIds.length > 0) {
      return this.prisma.asset.findMany({
        where: {
          area: {
            building: {
              siteId: { in: siteIds },
            },
          },
        },
        include: {
          area: {
            include: {
              building: {
                include: {
                  site: true,
                },
              },
            },
          },
        },
      });
    }

    return this.prisma.asset.findMany({
      include: {
        area: {
          include: {
            building: {
              include: {
                site: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string, user: any) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        area: {
          include: {
            building: {
              include: {
                site: true,
              },
            },
          },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    await this.checkSiteAccess(asset.area.building.siteId, user);

    return asset;
  }

  async update(id: string, updateAssetDto: UpdateAssetDto, user: any) {
    const asset = await this.findOne(id, user);

    const updatedAsset = await this.prisma.asset.update({
      where: { id },
      data: updateAssetDto,
      include: {
        area: {
          include: {
            building: {
              include: {
                site: true,
              },
            },
          },
        },
      },
    });

    await this.auditService.log(user.id, 'UPDATE', 'ASSET', asset.id);

    return updatedAsset;
  }

  async remove(id: string, userId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    await this.prisma.asset.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'ASSET', id);

    return { message: 'Asset deleted successfully' };
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