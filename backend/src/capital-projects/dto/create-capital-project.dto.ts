import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CapitalProjectStatus } from '@prisma/client';

export class CreateCapitalProjectDto {
  @ApiProperty({ description: 'Project title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Project description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Site ID' })
  @IsString()
  @IsNotEmpty()
  siteId: string;

  @ApiProperty({ description: 'Project budget' })
  @IsNumber()
  budget: number;

  @ApiProperty({ description: 'Project start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Target completion date' })
  @IsDateString()
  targetCompletionDate: string;

  @ApiProperty({ description: 'Project status', enum: CapitalProjectStatus, required: false })
  @IsOptional()
  @IsEnum(CapitalProjectStatus)
  status?: CapitalProjectStatus;
}