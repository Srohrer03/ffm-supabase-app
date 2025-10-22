import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetStatus } from '@prisma/client';

export class CreateAssetDto {
  @ApiProperty({ description: 'Asset name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Area ID' })
  @IsString()
  @IsNotEmpty()
  areaId: string;

  @ApiProperty({ description: 'Serial number', required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({ description: 'Model', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Manufacturer', required: false })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ description: 'Installation date', required: false })
  @IsOptional()
  @IsDateString()
  installDate?: string;

  @ApiProperty({ description: 'Asset status', enum: AssetStatus, required: false })
  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;
}