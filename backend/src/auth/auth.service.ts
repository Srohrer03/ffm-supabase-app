import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async handleCallback(azureUser: any) {
    // Upsert user from Azure AD
    const user = await this.prisma.user.upsert({
      where: { azureAdId: azureUser.oid },
      update: {
        name: azureUser.displayName || azureUser.name,
        email: azureUser.email || azureUser.upn,
      },
      create: {
        azureAdId: azureUser.oid,
        name: azureUser.displayName || azureUser.name,
        email: azureUser.email || azureUser.upn,
      },
      include: {
        roleAssignments: {
          include: {
            role: true,
          },
        },
      },
    });

    // Log login
    await this.auditService.log(user.id, 'LOGIN', 'USER', user.id);

    // Generate JWT with role claims
    const roles = user.roleAssignments.map(assignment => ({
      name: assignment.role.name,
      siteId: assignment.siteId,
    }));

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
      },
    };
  }

  async logout(userId: string) {
    await this.auditService.log(userId, 'LOGOUT', 'USER', userId);
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = user.roleAssignments.map(assignment => ({
      name: assignment.role.name,
      siteId: assignment.siteId,
    }));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
      createdAt: user.createdAt,
    };
  }
}