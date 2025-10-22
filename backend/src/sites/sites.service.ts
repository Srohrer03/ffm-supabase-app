import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createSiteDto: CreateSiteDto, userId: string) {
    const site = await this.prisma.site.create({
      data: createSiteDto,
    });

    await this.auditService.log(userId, 'CREATE', 'SITE', site.id);

    return site;
  }

  async findAll(user: any) {
    // Check if user has site-scoped permissions
    const siteIds = this.getUserSiteIds(user);
    
    if (siteIds.length > 0) {
      return this.prisma.site.findMany({
        where: {
          id: { in: siteIds },
        },
        include: {
          buildings: {
            include: {
              areas: {
                include: {
                  assets: true,
                },
              },
            },
          },
        },
      });
    }

    return this.prisma.site.findMany({
      include: {
        buildings: {
          include: {
            areas: {
              include: {
                assets: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string, user: any) {
    await this.checkSiteAccess(id, user);

    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        buildings: {
          include: {
            areas: {
              include: {
                assets: true,
              },
            },
          },
        },
      },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return site;
  }

  async getSiteAssets(id: string, user: any) {
    await this.checkSiteAccess(id, user);

    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        buildings: {
          include: {
            areas: {
              include: {
                assets: true,
              },
            },
          },
        },
      },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    // Flatten all assets from all buildings and areas
    const assets = site.buildings.flatMap(building =>
      building.areas.flatMap(area => area.assets)
    );

    return assets;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto, user: any) {
    await this.checkSiteAccess(id, user);

    const site = await this.prisma.site.update({
      where: { id },
      data: updateSiteDto,
    });

    await this.auditService.log(user.id, 'UPDATE', 'SITE', site.id);

    return site;
  }

  async remove(id: string, userId: string) {
    const site = await this.prisma.site.findUnique({
      where: { id },
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    await this.prisma.site.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'SITE', id);

    return { message: 'Site deleted successfully' };
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