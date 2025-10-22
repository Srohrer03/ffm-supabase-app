import { Module } from '@nestjs/common';
import { PMController } from './pm.controller';
import { PMService } from './pm.service';
import { PMSchedulerService } from './pm-scheduler.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PMController],
  providers: [PMService, PMSchedulerService],
  exports: [PMService, PMSchedulerService],
})
export class PMModule {}