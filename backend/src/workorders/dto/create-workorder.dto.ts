import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WorkOrderStatus, WorkOrderPriority } from '@prisma/client';

export class CreateWorkOrderDto {
  @ApiProperty({ description: 'Work order title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Work order description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Work order status', enum: WorkOrderStatus, required: false })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiProperty({ description: 'Work order priority', enum: WorkOrderPriority, required: false })
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority;

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
}