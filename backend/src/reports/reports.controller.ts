import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Reports')
@Controller('api/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('workorders/summary')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Get work orders summary report' })
  @ApiResponse({ status: 200, description: 'Returns work orders summary data' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO string)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site filter' })
  async getWorkOrdersSummary(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.reportsService.getWorkOrdersSummary(user, {
      startDate,
      endDate,
      siteId,
    });
  }

  @Get('pm/compliance')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Get PM compliance report' })
  @ApiResponse({ status: 200, description: 'Returns PM compliance data' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO string)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site filter' })
  async getPMCompliance(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.reportsService.getPMCompliance(user, {
      startDate,
      endDate,
      siteId,
    });
  }

  @Get('vendors/performance')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Get vendor performance report' })
  @ApiResponse({ status: 200, description: 'Returns vendor performance data' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO string)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site filter' })
  async getVendorPerformance(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.reportsService.getVendorPerformance(user, {
      startDate,
      endDate,
      siteId,
    });
  }

  @Get('assets/failure-rate')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Get asset failure rate report' })
  @ApiResponse({ status: 200, description: 'Returns asset failure rate data' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (ISO string)' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site filter' })
  async getAssetFailureRate(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('siteId') siteId?: string,
  ) {
    return this.reportsService.getAssetFailureRate(user, {
      startDate,
      endDate,
      siteId,
    });
  }

  @Get('dashboard/kpis')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  @ApiResponse({ status: 200, description: 'Returns dashboard KPI data' })
  @ApiQuery({ name: 'siteId', required: false, description: 'Site filter' })
  async getDashboardKPIs(
    @GetUser() user: any,
    @Query('siteId') siteId?: string,
  ) {
    return this.reportsService.getDashboardKPIs(user, { siteId });
  }
}