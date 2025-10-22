import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { VendorAssignmentsService } from './vendor-assignments.service';
import { CreateVendorAssignmentDto } from './dto/create-vendor-assignment.dto';
import { UpdateVendorAssignmentDto } from './dto/update-vendor-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Vendor Assignments')
@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VendorAssignmentsController {
  constructor(private readonly vendorAssignmentsService: VendorAssignmentsService) {}

  @Post('workorders/:workOrderId/vendors/:vendorId/assign')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Assign vendor to work order' })
  @ApiResponse({ status: 201, description: 'Vendor assigned successfully' })
  async assignVendor(
    @Param('workOrderId') workOrderId: string,
    @Param('vendorId') vendorId: string,
    @Body() createAssignmentDto: CreateVendorAssignmentDto,
    @GetUser() user: any,
  ) {
    return this.vendorAssignmentsService.assignVendor(
      workOrderId,
      vendorId,
      createAssignmentDto,
      user,
    );
  }

  @Get('workorders/:workOrderId/vendors')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get vendors assigned to work order' })
  @ApiResponse({ status: 200, description: 'Returns list of assigned vendors' })
  async getWorkOrderVendors(
    @Param('workOrderId') workOrderId: string,
    @GetUser() user: any,
  ) {
    return this.vendorAssignmentsService.getWorkOrderVendors(workOrderId, user);
  }

  @Patch('vendor-assignments/:id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.VENDOR)
  @ApiOperation({ summary: 'Update vendor assignment status' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  async updateAssignment(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateVendorAssignmentDto,
    @GetUser() user: any,
  ) {
    return this.vendorAssignmentsService.updateAssignment(id, updateAssignmentDto, user);
  }
}