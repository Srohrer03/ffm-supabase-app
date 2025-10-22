import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createVendorDto: CreateVendorDto, userId: string) {
    const vendor = await this.prisma.vendor.create({
      data: createVendorDto,
      include: {
        assignments: {
          include: {
            workOrder: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            assignments: true,
          },
        },
      },
    });

    await this.auditService.log(userId, 'CREATE', 'VENDOR', vendor.id);

    return vendor;
  }

  async findAll(user: any, filters: any = {}) {
    const where: any = {};

    // Apply filters
    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.category) {
      where.serviceCategories = {
        has: filters.category,
      };
    }

    // If user is a VENDOR, only show their own profile
    if (this.isVendorRole(user)) {
      where.contactEmail = user.email;
    }

    return this.prisma.vendor.findMany({
      where,
      include: {
        assignments: {
          include: {
            workOrder: {
              select: {
                id: true,
                title: true,
                status: true,
                site: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            assignedAt: 'desc',
          },
          take: 5, // Latest 5 assignments
        },
        _count: {
          select: {
            assignments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, user: any) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            workOrder: {
              select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                createdAt: true,
                site: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            assignedAt: 'desc',
          },
        },
        _count: {
          select: {
            assignments: true,
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // If user is a VENDOR, only allow access to their own profile
    if (this.isVendorRole(user) && vendor.contactEmail !== user.email) {
      throw new ForbiddenException('Access denied to this vendor profile');
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto, userId: string) {
    const existingVendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!existingVendor) {
      throw new NotFoundException('Vendor not found');
    }

    const vendor = await this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
      include: {
        assignments: {
          include: {
            workOrder: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            assignments: true,
          },
        },
      },
    });

    await this.auditService.log(userId, 'UPDATE', 'VENDOR', vendor.id);

    return vendor;
  }

  async remove(id: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    await this.prisma.vendor.delete({
      where: { id },
    });

    await this.auditService.log(userId, 'DELETE', 'VENDOR', id);

    return { message: 'Vendor deleted successfully' };
  }

  private isVendorRole(user: any): boolean {
    return user.roles?.some((role: any) => role.name === 'VENDOR') || false;
  }
}