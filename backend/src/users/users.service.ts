import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        roleAssignments: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async assignRole(userId: string, assignRoleDto: AssignRoleDto, currentUserId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if role exists
    const role = await this.prisma.role.findUnique({
      where: { id: assignRoleDto.roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Create role assignment
    const assignment = await this.prisma.userRoleAssignment.create({
      data: {
        userId,
        roleId: assignRoleDto.roleId,
        siteId: assignRoleDto.siteId,
      },
      include: {
        role: true,
        user: true,
      },
    });

    // Log the role assignment
    await this.auditService.log(
      currentUserId,
      'ROLE_ASSIGNED',
      'USER_ROLE_ASSIGNMENT',
      assignment.id,
    );

    return assignment;
  }
}