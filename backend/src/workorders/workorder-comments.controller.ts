import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { WorkOrderCommentsService } from './workorder-comments.service';
import { CreateWorkOrderCommentDto } from './dto/create-workorder-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Work Order Comments')
@Controller('api/workorders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkOrderCommentsController {
  constructor(private readonly commentsService: WorkOrderCommentsService) {}

  @Post(':id/comments')
  @Roles(RoleName.ADMIN, RoleName.FM, RoleName.TECH, RoleName.VENDOR)
  @ApiOperation({ summary: 'Add comment to work order' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id') workOrderId: string,
    @Body() createCommentDto: CreateWorkOrderCommentDto,
    @GetUser() user: any,
  ) {
    return this.commentsService.addComment(workOrderId, createCommentDto, user);
  }
}