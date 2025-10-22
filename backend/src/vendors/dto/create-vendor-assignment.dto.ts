import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorAssignmentDto {
  @ApiProperty({ description: 'Assignment notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}