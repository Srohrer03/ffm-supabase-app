import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Areas')
@Controller('api/areas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new area' })
  @ApiResponse({ status: 201, description: 'Area created successfully' })
  async create(@Body() createAreaDto: CreateAreaDto, @GetUser() user: any) {
    return this.areasService.create(createAreaDto, user);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all areas' })
  @ApiResponse({ status: 200, description: 'Returns list of areas' })
  async findAll(@GetUser() user: any) {
    return this.areasService.findAll(user);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get area by ID' })
  @ApiResponse({ status: 200, description: 'Returns area details' })
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.areasService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update area' })
  @ApiResponse({ status: 200, description: 'Area updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
    @GetUser() user: any,
  ) {
    return this.areasService.update(id, updateAreaDto, user);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete area' })
  @ApiResponse({ status: 200, description: 'Area deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.areasService.remove(id, user.id);
  }
}