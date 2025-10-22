import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceFrequency, WorkOrderPriority } from '@prisma/client';

export class CreateMaintenanceTemplateDto {
  @ApiProperty({ description: 'Template title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Maintenance frequency', enum: MaintenanceFrequency })
  @IsEnum(MaintenanceFrequency)
  frequency: MaintenanceFrequency;

  @ApiProperty({ description: 'Site ID' })
  @IsString()
  @IsNotEmpty()
  siteId: string;

  @ApiProperty({ description: 'Area ID', required: false })
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiProperty({ description: 'Asset ID', required: false })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiProperty({ description: 'Assigned to user ID', required: false })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiProperty({ description: 'Priority', enum: WorkOrderPriority, required: false })
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority;
}