import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCapitalProjectCommentDto {
  @ApiProperty({ description: 'Comment message' })
  @IsString()
  @IsNotEmpty()
  message: string;
}