import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { VendorPortalService } from './vendor-portal.service';
import { UpdateVendorAssignmentDto } from './dto/update-vendor-assignment.dto';
import { UpdateWorkOrderStatusDto } from '../workorders/dto/update-workorder-status.dto';
import { CreateWorkOrderCommentDto } from '../workorders/dto/create-workorder-comment.dto';
import { CreateWorkOrderAttachmentDto } from '../workorders/dto/create-workorder-attachment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Vendor Portal')
@Controller('api/vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VendorPortalController {
  constructor(private readonly vendorPortalService: VendorPortalService) {}

  @Get('me/assignments')
  @Roles(RoleName.VENDOR)
  @ApiOperation({ summary: 'Get all assignments for logged-in vendor' })
  @ApiResponse({ status: 200, description: 'Returns vendor assignments' })
  async getMyAssignments(@GetUser() user: any) {
    return this.vendorPortalService.getVendorAssignments(user);
  }

  @Patch('assignments/:id')
  @Roles(RoleName.VENDOR)
  @ApiOperation({ summary: 'Accept or decline assignment' })
  @ApiResponse({ status: 200, description: 'Assignment status updated' })
  async updateAssignmentStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateVendorAssignmentDto,
    @GetUser() user: any,
  ) {
    return this.vendorPortalService.updateAssignmentStatus(id, updateDto, user);
  }

  @Patch('workorders/:id/status')
  @Roles(RoleName.VENDOR)
  @ApiOperation({ summary: 'Update work order status' })
  @ApiResponse({ status: 200, description: 'Work order status updated' })
  async updateWorkOrderStatus(
    @Param('id') workOrderId: string,
    @Body() updateDto: UpdateWorkOrderStatusDto,
    @GetUser() user: any,
  ) {
    return this.vendorPortalService.updateWorkOrderStatus(workOrderId, updateDto, user);
  }

  @Post('workorders/:id/comments')
  @Roles(RoleName.VENDOR)
  @ApiOperation({ summary: 'Add comment to work order' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id') workOrderId: string,
    @Body() createCommentDto: CreateWorkOrderCommentDto,
    @GetUser() user: any,
  ) {
    return this.vendorPortalService.addWorkOrderComment(workOrderId, createCommentDto, user);
  }

  @Post('workorders/:id/attachments')
  @Roles(RoleName.VENDOR)
  @ApiOperation({ summary: 'Add attachment to work order' })
  @ApiResponse({ status: 201, description: 'Attachment added successfully' })
  async addAttachment(
    @Param('id') workOrderId: string,
    @Body() createAttachmentDto: CreateWorkOrderAttachmentDto,
    @GetUser() user: any,
  ) {
    return this.vendorPortalService.addWorkOrderAttachment(workOrderId, createAttachmentDto, user);
  }
}