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
import { CapitalProjectPhasesService } from './capital-project-phases.service';
import { CreateCapitalProjectPhaseDto } from './dto/create-capital-project-phase.dto';
import { UpdateCapitalProjectPhaseDto } from './dto/update-capital-project-phase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Capital Project Phases')
@Controller('api/capital-projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CapitalProjectPhasesController {
  constructor(private readonly phasesService: CapitalProjectPhasesService) {}

  @Post(':id/phases')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Add phase to capital project' })
  @ApiResponse({ status: 201, description: 'Phase added successfully' })
  async addPhase(
    @Param('id') projectId: string,
    @Body() createPhaseDto: CreateCapitalProjectPhaseDto,
    @GetUser() user: any,
  ) {
    return this.phasesService.addPhase(projectId, createPhaseDto, user);
  }

  @Patch('phases/:id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Update capital project phase' })
  @ApiResponse({ status: 200, description: 'Phase updated successfully' })
  async updatePhase(
    @Param('id') id: string,
    @Body() updatePhaseDto: UpdateCapitalProjectPhaseDto,
    @GetUser() user: any,
  ) {
    return this.phasesService.updatePhase(id, updatePhaseDto, user);
  }

  @Delete('phases/:id')
  @Roles(RoleName.ADMIN, RoleName.FM)
  @ApiOperation({ summary: 'Delete capital project phase' })
  @ApiResponse({ status: 200, description: 'Phase deleted successfully' })
  async removePhase(@Param('id') id: string, @GetUser() user: any) {
    return this.phasesService.removePhase(id, user.id);
  }
}