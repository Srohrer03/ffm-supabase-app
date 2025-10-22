import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { WorkOrdersService } from './workorders.service';
import { CreateWorkOrderDto } from './dto/create-workorder.dto';
import { UpdateWorkOrderDto } from './dto/update-workorder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Work Orders')
@Controller('api/workorders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new work order' })
  @ApiResponse({ status: 201, description: 'Work order created successfully' })
  async create(@Body() createWorkOrderDto: CreateWorkOrderDto, @GetUser() user: any) {
    return this.workOrdersService.create(createWorkOrderDto, user);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all work orders' })
  @ApiResponse({ status: 200, description: 'Returns list of work orders' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filter by priority' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Filter by site' })
  async findAll(
    @GetUser() user: any,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.workOrdersService.findAll(user, { status, priority, siteId });
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get work order by ID with comments and attachments' })
  @ApiResponse({ status: 200, description: 'Returns work order details' })
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.workOrdersService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR)
  @ApiOperation({ summary: 'Update work order' })
  @ApiResponse({ status: 200, description: 'Work order updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @GetUser() user: any,
  ) {
    return this.workOrdersService.update(id, updateWorkOrderDto, user);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete work order' })
  @ApiResponse({ status: 200, description: 'Work order deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.workOrdersService.remove(id, user.id);
  }
}