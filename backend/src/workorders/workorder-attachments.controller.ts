import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { WorkOrderAttachmentsService } from './workorder-attachments.service';
import { CreateWorkOrderAttachmentDto } from './dto/create-workorder-attachment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Work Order Attachments')
@Controller('api/workorders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkOrderAttachmentsController {
  constructor(private readonly attachmentsService: WorkOrderAttachmentsService) {}

  @Post(':id/attachments')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR)
  @ApiOperation({ summary: 'Add attachment to work order' })
  @ApiResponse({ status: 201, description: 'Attachment added successfully' })
  async addAttachment(
    @Param('id') workOrderId: string,
    @Body() createAttachmentDto: CreateWorkOrderAttachmentDto,
    @GetUser() user: any,
  ) {
    return this.attachmentsService.addAttachment(workOrderId, createAttachmentDto, user);
  }
}