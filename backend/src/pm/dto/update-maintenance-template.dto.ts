import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceTemplateDto } from './create-maintenance-template.dto';

export class UpdateMaintenanceTemplateDto extends PartialType(CreateMaintenanceTemplateDto) {}