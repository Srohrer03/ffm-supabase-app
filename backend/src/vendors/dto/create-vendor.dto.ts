import { IsString, IsNotEmpty, IsEmail, IsArray, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ description: 'Vendor company name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Primary contact person name' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ description: 'Contact email address' })
  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiProperty({ description: 'Array of service categories', type: [String] })
  @IsArray()
  @IsString({ each: true })
  serviceCategories: string[];

  @ApiProperty({ description: 'Insurance expiration date', required: false })
  @IsOptional()
  @IsDateString()
  insuranceExpiresAt?: string;

  @ApiProperty({ description: 'Whether vendor is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}