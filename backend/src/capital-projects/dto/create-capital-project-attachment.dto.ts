import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCapitalProjectAttachmentDto {
  @ApiProperty({ description: 'Attachment URL' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Filename' })
  @IsString()
  @IsNotEmpty()
  filename: string;
}