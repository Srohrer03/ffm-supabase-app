import { Module } from '@nestjs/common';
import { CapitalProjectsController } from './capital-projects.controller';
import { CapitalProjectsService } from './capital-projects.service';
import { CapitalProjectPhasesController } from './capital-project-phases.controller';
import { CapitalProjectPhasesService } from './capital-project-phases.service';
import { CapitalProjectCommentsController } from './capital-project-comments.controller';
import { CapitalProjectCommentsService } from './capital-project-comments.service';
import { CapitalProjectAttachmentsController } from './capital-project-attachments.controller';
import { CapitalProjectAttachmentsService } from './capital-project-attachments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [
    CapitalProjectsController,
    CapitalProjectPhasesController,
    CapitalProjectCommentsController,
    CapitalProjectAttachmentsController,
  ],
  providers: [
    CapitalProjectsService,
    CapitalProjectPhasesService,
    CapitalProjectCommentsService,
    CapitalProjectAttachmentsService,
  ],
  exports: [
    CapitalProjectsService,
    CapitalProjectPhasesService,
    CapitalProjectCommentsService,
    CapitalProjectAttachmentsService,
  ],
})
export class CapitalProjectsModule {}