import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CapitalProjectPhaseStatus } from '@prisma/client';

export class CreateCapitalProjectPhaseDto {
  @ApiProperty({ description: 'Phase title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Phase description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Phase start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Phase end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Phase status', enum: CapitalProjectPhaseStatus, required: false })
  @IsOptional()
  @IsEnum(CapitalProjectPhaseStatus)
  status?: CapitalProjectPhaseStatus;

  @ApiProperty({ description: 'Cost estimate', required: false })
  @IsOptional()
  @IsNumber()
  costEstimate?: number;

  @ApiProperty({ description: 'Actual cost', required: false })
  @IsOptional()
  @IsNumber()
  actualCost?: number;
}