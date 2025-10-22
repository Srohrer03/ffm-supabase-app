import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CapitalProjectAttachmentsService } from './capital-project-attachments.service';
import { CreateCapitalProjectAttachmentDto } from './dto/create-capital-project-attachment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Capital Project Attachments')
@Controller('api/capital-projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CapitalProjectAttachmentsController {
  constructor(private readonly attachmentsService: CapitalProjectAttachmentsService) {}

  @Post(':id/attachments')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR)
  @ApiOperation({ summary: 'Add attachment to capital project' })
  @ApiResponse({ status: 201, description: 'Attachment added successfully' })
  async addAttachment(
    @Param('id') projectId: string,
    @Body() createAttachmentDto: CreateCapitalProjectAttachmentDto,
    @GetUser() user: any,
  ) {
    return this.attachmentsService.addAttachment(projectId, createAttachmentDto, user);
  }
}