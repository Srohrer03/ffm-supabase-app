import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CapitalProjectCommentsService } from './capital-project-comments.service';
import { CreateCapitalProjectCommentDto } from './dto/create-capital-project-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Capital Project Comments')
@Controller('api/capital-projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CapitalProjectCommentsController {
  constructor(private readonly commentsService: CapitalProjectCommentsService) {}

  @Post(':id/comments')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR)
  @ApiOperation({ summary: 'Add comment to capital project' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id') projectId: string,
    @Body() createCommentDto: CreateCapitalProjectCommentDto,
    @GetUser() user: any,
  ) {
    return this.commentsService.addComment(projectId, createCommentDto, user);
  }
}