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
import { CapitalProjectsService } from './capital-projects.service';
import { CreateCapitalProjectDto } from './dto/create-capital-project.dto';
import { UpdateCapitalProjectDto } from './dto/update-capital-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Capital Projects')
@Controller('api/capital-projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CapitalProjectsController {
  constructor(private readonly capitalProjectsService: CapitalProjectsService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new capital project' })
  @ApiResponse({ status: 201, description: 'Capital project created successfully' })
  async create(@Body() createCapitalProjectDto: CreateCapitalProjectDto, @GetUser() user: any) {
    return this.capitalProjectsService.create(createCapitalProjectDto, user);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all capital projects' })
  @ApiResponse({ status: 200, description: 'Returns list of capital projects' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Filter by site' })
  async findAll(
    @GetUser() user: any,
    @Query('status') status?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.capitalProjectsService.findAll(user, { status, siteId });
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get capital project by ID with phases, comments, and attachments' })
  @ApiResponse({ status: 200, description: 'Returns capital project details' })
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.capitalProjectsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update capital project' })
  @ApiResponse({ status: 200, description: 'Capital project updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateCapitalProjectDto: UpdateCapitalProjectDto,
    @GetUser() user: any,
  ) {
    return this.capitalProjectsService.update(id, updateCapitalProjectDto, user);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete capital project' })
  @ApiResponse({ status: 200, description: 'Capital project deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.capitalProjectsService.remove(id, user.id);
  }
}