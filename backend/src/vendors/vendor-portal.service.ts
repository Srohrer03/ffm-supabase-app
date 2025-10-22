import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateVendorAssignmentDto } from './dto/update-vendor-assignment.dto';
import { UpdateWorkOrderStatusDto } from '../workorders/dto/update-workorder-status.dto';
import { CreateWorkOrderCommentDto } from '../workorders/dto/create-workorder-comment.dto';
import { CreateWorkOrderAttachmentDto } from '../workorders/dto/create-workorder-attachment.dto';

@Injectable()
export class VendorPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getVendorAssignments(user: any) {
    // Find vendor by email
    const vendor = await this.prisma.vendor.findUnique({
      where: { contactEmail: user.email },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return this.prisma.vendorAssignment.findMany({
      where: { vendorId: vendor.id },
      include: {
        workOrder: {
          include: {
            site: { select: { name: true } },
            area: { select: { name: true } },
            asset: { select: { name: true } },
            requester: { select: { name: true, email: true } },
            assignedTo: { select: { name: true, email: true } },
            comments: {
              include: {
                user: { select: { name: true, email: true } },
              },
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
            attachments: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
            _count: {
              select: {
                comments: true,
                attachments: true,
              },
            },
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async updateAssignmentStatus(id: string, updateDto: UpdateVendorAssignmentDto, user: any) {
    const assignment = await this.prisma.vendorAssignment.findUnique({
      where: { id },
      include: {
        vendor: true,
        workOrder: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Verify vendor owns this assignment
    if (assignment.vendor.contactEmail !== user.email) {
      throw new ForbiddenException('Access denied to this assignment');
    }

    const updatedAssignment = await this.prisma.vendorAssignment.update({
      where: { id },
      data: updateDto,
      include: {
        workOrder: {
          include: {
            site: { select: { name: true } },
          },
        },
      },
    });

    // Log the status change
    await this.auditService.log(
      user.id,
      'VENDOR_ASSIGNMENT_STATUS_CHANGED',
      'VENDOR_ASSIGNMENT',
      id,
    );

    return updatedAssignment;
  }

  async updateWorkOrderStatus(workOrderId: string, updateDto: UpdateWorkOrderStatusDto, user: any) {
    // Verify vendor has access to this work order
    const vendor = await this.prisma.vendor.findUnique({
      where: { contactEmail: user.email },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const assignment = await this.prisma.vendorAssignment.findFirst({
      where: {
        vendorId: vendor.id,
        workOrderId,
        status: 'ACCEPTED',
      },
      include: {
        workOrder: true,
      },
    });

    if (!assignment) {
      throw new ForbiddenException('No accepted assignment found for this work order');
    }

    // Vendors can only update to IN_PROGRESS or COMPLETED
    if (!['IN_PROGRESS', 'COMPLETED'].includes(updateDto.status)) {
      throw new BadRequestException('Vendors can only set status to IN_PROGRESS or COMPLETED');
    }

    const updatedWorkOrder = await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: {
        status: updateDto.status,
        completedAt: updateDto.status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        site: { select: { name: true } },
        area: { select: { name: true } },
        asset: { select: { name: true } },
        requester: { select: { name: true, email: true } },
        assignedTo: { select: { name: true, email: true } },
      },
    });

    // Log the status change
    await this.auditService.log(
      user.id,
      'VENDOR_WORK_ORDER_STATUS_CHANGED',
      'WORK_ORDER',
      workOrderId,
    );

    return updatedWorkOrder;
  }

  async addWorkOrderComment(workOrderId: string, createCommentDto: CreateWorkOrderCommentDto, user: any) {
    // Verify vendor has access to this work order
    const vendor = await this.prisma.vendor.findUnique({
      where: { contactEmail: user.email },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const assignment = await this.prisma.vendorAssignment.findFirst({
      where: {
        vendorId: vendor.id,
        workOrderId,
        status: 'ACCEPTED',
      },
    });

    if (!assignment) {
      throw new ForbiddenException('No accepted assignment found for this work order');
    }

    const comment = await this.prisma.workOrderComment.create({
      data: {
        workOrderId,
        userId: user.id,
        message: createCommentDto.message,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Log the comment addition
    await this.auditService.log(
      user.id,
      'VENDOR_COMMENT_ADDED',
      'WORK_ORDER',
      workOrderId,
    );

    return comment;
  }

  async addWorkOrderAttachment(workOrderId: string, createAttachmentDto: CreateWorkOrderAttachmentDto, user: any) {
    // Verify vendor has access to this work order
    const vendor = await this.prisma.vendor.findUnique({
      where: { contactEmail: user.email },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const assignment = await this.prisma.vendorAssignment.findFirst({
      where: {
        vendorId: vendor.id,
        workOrderId,
        status: 'ACCEPTED',
      },
    });

    if (!assignment) {
      throw new ForbiddenException('No accepted assignment found for this work order');
    }

    const attachment = await this.prisma.workOrderAttachment.create({
      data: {
        workOrderId,
        url: createAttachmentDto.url,
        filename: createAttachmentDto.filename,
      },
    });

    // Log the attachment addition
    await this.auditService.log(
      user.id,
      'VENDOR_ATTACHMENT_ADDED',
      'WORK_ORDER',
      workOrderId,
    );

    return attachment;
  }
}