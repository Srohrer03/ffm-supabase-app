import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({ description: 'Area name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Building ID' })
  @IsString()
  @IsNotEmpty()
  buildingId: string;
}