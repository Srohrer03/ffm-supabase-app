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
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Assets')
@Controller('api/assets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  async create(@Body() createAssetDto: CreateAssetDto, @GetUser() user: any) {
    return this.assetsService.create(createAssetDto, user);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({ status: 200, description: 'Returns list of assets' })
  async findAll(@GetUser() user: any) {
    return this.assetsService.findAll(user);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({ status: 200, description: 'Returns asset details' })
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.assetsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateAssetDto: UpdateAssetDto,
    @GetUser() user: any,
  ) {
    return this.assetsService.update(id, updateAssetDto, user);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete asset' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.assetsService.remove(id, user.id);
  }
}