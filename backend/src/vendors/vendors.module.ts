import { Module } from '@nestjs/common';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { VendorAssignmentsController } from './vendor-assignments.controller';
import { VendorAssignmentsService } from './vendor-assignments.service';
import { VendorPortalController } from './vendor-portal.controller';
import { VendorPortalService } from './vendor-portal.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [VendorsController, VendorAssignmentsController, VendorPortalController],
  providers: [VendorsService, VendorAssignmentsService, VendorPortalService],
  exports: [VendorsService, VendorAssignmentsService, VendorPortalService],
})
export class VendorsModule {}