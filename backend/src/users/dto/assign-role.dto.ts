import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ description: 'Role ID to assign' })
  @IsString()
  roleId: string;

  @ApiProperty({ description: 'Site ID for site-scoped permissions', required: false })
  @IsOptional()
  @IsString()
  siteId?: string;
}