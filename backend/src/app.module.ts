import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuditModule } from './audit/audit.module';
import { SitesModule } from './sites/sites.module';
import { WorkOrdersModule } from './workorders/workorders.module';
import { PMModule } from './pm/pm.module';
import { VendorsModule } from './vendors/vendors.module';
import { ReportsModule } from './reports/reports.module';
import { CapitalProjectsModule } from './capital-projects/capital-projects.module';

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    SitesModule,
    WorkOrdersModule,
    PMModule,
    VendorsModule,
    ReportsModule,
    CapitalProjectsModule,
  ],
})
export class AppModule {}