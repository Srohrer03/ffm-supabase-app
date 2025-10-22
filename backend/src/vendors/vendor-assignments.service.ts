import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateVendorAssignmentDto } from './dto/create-vendor-assignment.dto';
import { UpdateVendorAssignmentDto } from './dto/update-vendor-assignment.dto';

@Injectable()
export class VendorAssignmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async assignVendor(
    workOrderId: string,
    vendorId: string,
    createAssignmentDto: CreateVendorAssignmentDto,
    user: any,
  ) {
    // Check if work order exists and user has access
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { site: true },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    await this.checkSiteAccess(workOrder.siteId, user);

    // Check if vendor exists and is active
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (!vendor.active) {
      throw new BadRequestException('Cannot assign inactive vendor');
    }

    // Check if assignment already exists
    const existingAssignment = await this.prisma.vendorAssignment.findUnique({
      where: {
        vendorId_workOrderId: {
          vendorId,
          workOrderId,
        },
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('Vendor is already assigned to this work order');
    }

    const assignment = await this.prisma.vendorAssignment.create({
      data: {
        vendorId,
        workOrderId,
        notes: createAssignmentDto.notes,
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            contactName: true,
            contactEmail: true,
            contactPhone: true,
            serviceCategories: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            site: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    await this.auditService.log(user.id, 'VENDOR_ASSIGNED', 'VENDOR_ASSIGNMENT', assignment.id);

    return assignment;
  }

  async getWorkOrderVendors(workOrderId: string, user: any) {
    // Check if work order exists and user has access
    const workOrder = await this.prisma.workOrder.findUnique({
      where: { id: workOrderId },
      select: { siteId: true },
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    await this.checkSiteAccess(workOrder.siteId, user);

    return this.prisma.vendorAssignment.findMany({
      where: { workOrderId },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            contactName: true,
            contactEmail: true,
            contactPhone: true,
            serviceCategories: true,
            active: true,
          },
        },
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });
  }

  async updateAssignment(id: string, updateAssignmentDto: UpdateVendorAssignmentDto, user: any) {
    const assignment = await this.prisma.vendorAssignment.findUnique({
      where: { id },
      include: {
        vendor: true,
        workOrder: {
          include: {
            site: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Vendor assignment not found');
    }

    // Check permissions
    const userRoles = user.roles?.map((r: any) => r.name) || [];
    const isVendor = userRoles.includes('VENDOR');
    const isAdminOrFM = userRoles.some((role: string) => ['ADMIN', 'FM'].includes(role));

    if (isVendor) {
      // Vendors can only update their own assignments
      if (assignment.vendor.contactEmail !== user.email) {
        throw new ForbiddenException('Access denied to this assignment');
      }
      // Vendors can only update status, not notes
      if (updateAssignmentDto.notes !== undefined) {
        throw new ForbiddenException('Vendors cannot update assignment notes');
      }
    } else if (!isAdminOrFM) {
      // Check site access for other roles
      await this.checkSiteAccess(assignment.workOrder.siteId, user);
    }

    const updatedAssignment = await this.prisma.vendorAssignment.update({
      where: { id },
      data: updateAssignmentDto,
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            contactName: true,
            contactEmail: true,
            contactPhone: true,
            serviceCategories: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            site: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Log status changes
    if (updateAssignmentDto.status) {
      await this.auditService.log(
        user.id,
        'ASSIGNMENT_STATUS_CHANGED',
        'VENDOR_ASSIGNMENT',
        assignment.id,
      );
    }

    return updatedAssignment;
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