import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkOrdersSummary(user: any, filters: any = {}) {
    const siteIds = this.getUserSiteIds(user);
    const where = this.buildSiteFilter(siteIds, filters.siteId);

    // Add date filters
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const [
      totalCount,
      statusCounts,
      priorityCounts,
      avgCompletionTime,
      siteCounts,
      monthlyTrend
    ] = await Promise.all([
      // Total work orders
      this.prisma.workOrder.count({ where }),

      // Count by status
      this.prisma.workOrder.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),

      // Count by priority
      this.prisma.workOrder.groupBy({
        by: ['priority'],
        where,
        _count: { id: true },
      }),

      // Average completion time
      this.prisma.workOrder.aggregate({
        where: {
          ...where,
          status: 'COMPLETED',
          completedAt: { not: null },
        },
        _avg: {
          completedAt: true,
        },
      }),

      // Count by site
      this.prisma.workOrder.groupBy({
        by: ['siteId'],
        where,
        _count: { id: true },
        include: {
          site: {
            select: { name: true },
          },
        },
      }),

      // Monthly trend (last 6 months)
      this.getMonthlyWorkOrderTrend(where),
    ]);

    return {
      summary: {
        total: totalCount,
        avgCompletionDays: this.calculateAvgCompletionDays(avgCompletionTime._avg.completedAt),
      },
      byStatus: statusCounts.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      byPriority: priorityCounts.map(item => ({
        priority: item.priority,
        count: item._count.id,
      })),
      bySite: siteCounts.map(item => ({
        siteId: item.siteId,
        count: item._count.id,
      })),
      monthlyTrend,
    };
  }

  async getPMCompliance(user: any, filters: any = {}) {
    const siteIds = this.getUserSiteIds(user);
    const where: any = {};

    if (siteIds.length > 0) {
      where.template = { siteId: { in: siteIds } };
    }

    if (filters.siteId) {
      where.template = { ...where.template, siteId: filters.siteId };
    }

    // Add date filters
    if (filters.startDate || filters.endDate) {
      where.scheduledDate = {};
      if (filters.startDate) where.scheduledDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.scheduledDate.lte = new Date(filters.endDate);
    }

    const [
      totalOccurrences,
      statusCounts,
      complianceByTemplate,
      upcomingDue
    ] = await Promise.all([
      // Total PM occurrences
      this.prisma.maintenanceOccurrence.count({ where }),

      // Count by status
      this.prisma.maintenanceOccurrence.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),

      // Compliance by template
      this.prisma.maintenanceTemplate.findMany({
        where: siteIds.length > 0 ? { siteId: { in: siteIds } } : {},
        include: {
          _count: {
            select: {
              occurrences: {
                where: {
                  status: 'COMPLETED',
                  scheduledDate: {
                    gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                  },
                },
              },
            },
          },
          site: { select: { name: true } },
        },
      }),

      // Upcoming due (next 30 days)
      this.prisma.maintenanceOccurrence.count({
        where: {
          ...where,
          status: 'PENDING',
          scheduledDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const completedCount = statusCounts.find(s => s.status === 'COMPLETED')?._count.id || 0;
    const complianceRate = totalOccurrences > 0 ? (completedCount / totalOccurrences) * 100 : 0;

    return {
      summary: {
        total: totalOccurrences,
        completed: completedCount,
        complianceRate: Math.round(complianceRate),
        upcomingDue,
      },
      byStatus: statusCounts.map(item => ({
        status: item.status,
        count: item._count.id,
      })),
      byTemplate: complianceByTemplate.map(template => ({
        templateId: template.id,
        title: template.title,
        site: template.site?.name,
        completedCount: template._count.occurrences,
      })),
    };
  }

  async getVendorPerformance(user: any, filters: any = {}) {
    const siteIds = this.getUserSiteIds(user);
    const where: any = {};

    if (siteIds.length > 0) {
      where.workOrder = { siteId: { in: siteIds } };
    }

    if (filters.siteId) {
      where.workOrder = { ...where.workOrder, siteId: filters.siteId };
    }

    // Add date filters
    if (filters.startDate || filters.endDate) {
      where.assignedAt = {};
      if (filters.startDate) where.assignedAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.assignedAt.lte = new Date(filters.endDate);
    }

    const vendorStats = await this.prisma.vendorAssignment.groupBy({
      by: ['vendorId'],
      where,
      _count: { id: true },
      _avg: { assignedAt: true },
    });

    const vendorDetails = await this.prisma.vendor.findMany({
      where: {
        id: { in: vendorStats.map(v => v.vendorId) },
      },
      include: {
        assignments: {
          where,
          include: {
            workOrder: {
              select: {
                status: true,
                completedAt: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return vendorDetails.map(vendor => {
      const stats = vendorStats.find(s => s.vendorId === vendor.id);
      const completedAssignments = vendor.assignments.filter(
        a => a.workOrder.status === 'COMPLETED'
      );
      
      const avgCompletionTime = completedAssignments.length > 0
        ? completedAssignments.reduce((sum, assignment) => {
            const start = new Date(assignment.assignedAt);
            const end = new Date(assignment.workOrder.completedAt);
            return sum + (end.getTime() - start.getTime());
          }, 0) / completedAssignments.length / (1000 * 60 * 60 * 24) // Convert to days
        : 0;

      return {
        vendorId: vendor.id,
        name: vendor.name,
        totalAssignments: stats?._count.id || 0,
        completedAssignments: completedAssignments.length,
        avgCompletionDays: Math.round(avgCompletionTime),
        completionRate: stats?._count.id > 0 
          ? Math.round((completedAssignments.length / stats._count.id) * 100)
          : 0,
      };
    });
  }

  async getAssetFailureRate(user: any, filters: any = {}) {
    const siteIds = this.getUserSiteIds(user);
    const where: any = { assetId: { not: null } };

    if (siteIds.length > 0) {
      where.siteId = { in: siteIds };
    }

    if (filters.siteId) {
      where.siteId = filters.siteId;
    }

    // Add date filters
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const assetWorkOrders = await this.prisma.workOrder.groupBy({
      by: ['assetId'],
      where,
      _count: { id: true },
    });

    const assets = await this.prisma.asset.findMany({
      where: {
        id: { in: assetWorkOrders.map(a => a.assetId).filter(Boolean) },
      },
      include: {
        area: {
          include: {
            building: {
              include: {
                site: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    return assets.map(asset => {
      const workOrderCount = assetWorkOrders.find(wo => wo.assetId === asset.id)?._count.id || 0;
      
      return {
        assetId: asset.id,
        name: asset.name,
        site: asset.area.building.site.name,
        area: asset.area.name,
        building: asset.area.building.name,
        workOrderCount,
        status: asset.status,
      };
    }).sort((a, b) => b.workOrderCount - a.workOrderCount);
  }

  async getDashboardKPIs(user: any, filters: any = {}) {
    const siteIds = this.getUserSiteIds(user);
    const where = this.buildSiteFilter(siteIds, filters.siteId);

    const [
      totalWorkOrders,
      openWorkOrders,
      completedThisMonth,
      avgCompletionTime,
      totalAssets,
      activeVendors,
      pmCompliance
    ] = await Promise.all([
      this.prisma.workOrder.count({ where }),
      this.prisma.workOrder.count({ where: { ...where, status: 'OPEN' } }),
      this.prisma.workOrder.count({
        where: {
          ...where,
          status: 'COMPLETED',
          completedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.workOrder.aggregate({
        where: {
          ...where,
          status: 'COMPLETED',
          completedAt: { not: null },
        },
        _avg: { completedAt: true },
      }),
      this.prisma.asset.count({
        where: siteIds.length > 0 ? {
          area: { building: { siteId: { in: siteIds } } }
        } : {},
      }),
      this.prisma.vendor.count({ where: { active: true } }),
      this.getPMComplianceRate(siteIds, filters.siteId),
    ]);

    return {
      workOrders: {
        total: totalWorkOrders,
        open: openWorkOrders,
        completedThisMonth,
        avgCompletionDays: this.calculateAvgCompletionDays(avgCompletionTime._avg.completedAt),
      },
      assets: {
        total: totalAssets,
      },
      vendors: {
        active: activeVendors,
      },
      pm: {
        complianceRate: pmCompliance,
      },
    };
  }

  private getUserSiteIds(user: any): string[] {
    if (!user.roles) return [];
    
    return user.roles
      .filter((role: any) => role.siteId)
      .map((role: any) => role.siteId);
  }

  private buildSiteFilter(siteIds: string[], filterSiteId?: string) {
    const where: any = {};
    
    if (filterSiteId) {
      where.siteId = filterSiteId;
    } else if (siteIds.length > 0) {
      where.siteId = { in: siteIds };
    }
    
    return where;
  }

  private calculateAvgCompletionDays(avgCompletedAt: Date | null): number {
    if (!avgCompletedAt) return 0;
    
    // This is a simplified calculation - in reality you'd need to track creation vs completion time
    return 3; // Placeholder - implement proper calculation based on your needs
  }

  private async getMonthlyWorkOrderTrend(where: any) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await this.prisma.workOrder.groupBy({
      by: ['createdAt'],
      where: {
        ...where,
        createdAt: { gte: sixMonthsAgo },
      },
      _count: { id: true },
    });

    // Group by month and return formatted data
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      const count = monthlyData.filter(item => 
        item.createdAt.toISOString().slice(0, 7) === monthKey
      ).reduce((sum, item) => sum + item._count.id, 0);

      monthlyTrend.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        count,
      });
    }

    return monthlyTrend;
  }

  private async getPMComplianceRate(siteIds: string[], filterSiteId?: string): Promise<number> {
    const where: any = {};
    
    if (filterSiteId) {
      where.template = { siteId: filterSiteId };
    } else if (siteIds.length > 0) {
      where.template = { siteId: { in: siteIds } };
    }

    const [total, completed] = await Promise.all([
      this.prisma.maintenanceOccurrence.count({ where }),
      this.prisma.maintenanceOccurrence.count({
        where: { ...where, status: 'COMPLETED' },
      }),
    ]);

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}