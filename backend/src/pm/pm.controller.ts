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
import { PMService } from './pm.service';
import { CreateMaintenanceTemplateDto } from './dto/create-maintenance-template.dto';
import { UpdateMaintenanceTemplateDto } from './dto/update-maintenance-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Preventive Maintenance')
@Controller('api/pm')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PMController {
  constructor(private readonly pmService: PMService) {}

  @Post('templates')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new maintenance template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(
    @Body() createTemplateDto: CreateMaintenanceTemplateDto,
    @GetUser() user: any,
  ) {
    return this.pmService.createTemplate(createTemplateDto, user);
  }

  @Get('templates')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all maintenance templates' })
  @ApiResponse({ status: 200, description: 'Returns list of templates' })
  async getTemplates(@GetUser() user: any) {
    return this.pmService.getTemplates(user);
  }

  @Get('templates/:id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({ status: 200, description: 'Returns template details' })
  async getTemplate(@Param('id') id: string, @GetUser() user: any) {
    return this.pmService.getTemplate(id, user);
  }

  @Get('templates/:id/occurrences')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all occurrences for a template' })
  @ApiResponse({ status: 200, description: 'Returns list of occurrences' })
  async getTemplateOccurrences(@Param('id') id: string, @GetUser() user: any) {
    return this.pmService.getTemplateOccurrences(id, user);
  }

  @Patch('templates/:id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update maintenance template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateMaintenanceTemplateDto,
    @GetUser() user: any,
  ) {
    return this.pmService.updateTemplate(id, updateTemplateDto, user);
  }

  @Delete('templates/:id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete maintenance template' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  async deleteTemplate(@Param('id') id: string, @GetUser() user: any) {
    return this.pmService.deleteTemplate(id, user.id);
  }

  @Patch('occurrences/:id/skip')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH)
  @ApiOperation({ summary: 'Skip a maintenance occurrence' })
  @ApiResponse({ status: 200, description: 'Occurrence skipped successfully' })
  async skipOccurrence(@Param('id') id: string, @GetUser() user: any) {
    return this.pmService.skipOccurrence(id, user);
  }

  @Get('calendar')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get PM calendar with upcoming occurrences' })
  @ApiResponse({ status: 200, description: 'Returns calendar of upcoming PM tasks' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for calendar (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for calendar (ISO string)' })
  async getCalendar(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.pmService.getCalendar(user, startDate, endDate);
  }
}