import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBuildingDto {
  @ApiProperty({ description: 'Building name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Site ID' })
  @IsString()
  @IsNotEmpty()
  siteId: string;
}