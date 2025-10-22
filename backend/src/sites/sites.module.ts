import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [
    SitesController,
    BuildingsController,
    AreasController,
    AssetsController,
  ],
  providers: [
    SitesService,
    BuildingsService,
    AreasService,
    AssetsService,
  ],
  exports: [
    SitesService,
    BuildingsService,
    AreasService,
    AssetsService,
  ],
})
export class SitesModule {}