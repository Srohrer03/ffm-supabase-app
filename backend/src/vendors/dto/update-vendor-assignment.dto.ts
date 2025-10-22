import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VendorAssignmentStatus } from '@prisma/client';

export class UpdateVendorAssignmentDto {
  @ApiProperty({ description: 'Assignment status', enum: VendorAssignmentStatus, required: false })
  @IsOptional()
  @IsEnum(VendorAssignmentStatus)
  status?: VendorAssignmentStatus;

  @ApiProperty({ description: 'Assignment notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}