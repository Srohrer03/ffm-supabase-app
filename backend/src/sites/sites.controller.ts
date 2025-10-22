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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Sites')
@Controller('api/sites')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  async create(@Body() createSiteDto: CreateSiteDto, @GetUser() user: any) {
    return this.sitesService.create(createSiteDto, user.id);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all sites' })
  @ApiResponse({ status: 200, description: 'Returns list of sites' })
  async findAll(@GetUser() user: any) {
    return this.sitesService.findAll(user);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get site by ID' })
  @ApiResponse({ status: 200, description: 'Returns site details' })
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.sitesService.findOne(id, user);
  }

  @Get(':id/assets')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all assets within a site' })
  @ApiResponse({ status: 200, description: 'Returns list of assets in the site' })
  async getSiteAssets(@Param('id') id: string, @GetUser() user: any) {
    return this.sitesService.getSiteAssets(id, user);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update site' })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @GetUser() user: any,
  ) {
    return this.sitesService.update(id, updateSiteDto, user);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete site' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.sitesService.remove(id, user.id);
  }
}