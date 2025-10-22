import { Module } from '@nestjs/common';
import { WorkOrdersController } from './workorders.controller';
import { WorkOrdersService } from './workorders.service';
import { WorkOrderCommentsController } from './workorder-comments.controller';
import { WorkOrderCommentsService } from './workorder-comments.service';
import { WorkOrderAttachmentsController } from './workorder-attachments.controller';
import { WorkOrderAttachmentsService } from './workorder-attachments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PMModule } from '../pm/pm.module';

@Module({
  imports: [PrismaModule, AuditModule, PMModule],
  controllers: [
    WorkOrdersController,
    WorkOrderCommentsController,
    WorkOrderAttachmentsController,
  ],
  providers: [
    WorkOrdersService,
    WorkOrderCommentsService,
    WorkOrderAttachmentsService,
  ],
  exports: [
    WorkOrdersService,
    WorkOrderCommentsService,
    WorkOrderAttachmentsService,
  ],
})
export class WorkOrdersModule {}