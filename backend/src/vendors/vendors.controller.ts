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
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Vendors')
@Controller('api/vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  async create(@Body() createVendorDto: CreateVendorDto, @GetUser() user: any) {
    return this.vendorsService.create(createVendorDto, user.id);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'Returns list of vendors' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by service category' })
  async findAll(
    @GetUser() user: any,
    @Query('active') active?: string,
    @Query('category') category?: string,
  ) {
    const filters = {
      active: active !== undefined ? active === 'true' : undefined,
      category,
    };
    return this.vendorsService.findAll(user, filters);
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR, RoleName.VIEWER)
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Returns vendor details' })
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.vendorsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update vendor' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @GetUser() user: any,
  ) {
    return this.vendorsService.update(id, updateVendorDto, user.id);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete vendor' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  async remove(@Param('id') id: string, @GetUser() user: any) {
    return this.vendorsService.remove(id, user.id);
  }
}