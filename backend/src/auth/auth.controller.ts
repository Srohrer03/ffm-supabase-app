import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('azure-ad'))
  @ApiOperation({ summary: 'Initiate Azure AD login' })
  @ApiResponse({ status: 302, description: 'Redirects to Azure AD login' })
  async login() {
    // This will redirect to Azure AD
  }

  @Get('callback')
  @UseGuards(AuthGuard('azure-ad'))
  @ApiOperation({ summary: 'Handle Azure AD callback' })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  async callback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.handleCallback(req.user);
    
    // In production, you might want to redirect to frontend with token
    // For now, return JSON response
    res.json(result);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@GetUser() user: any, @Res() res: Response) {
    await this.authService.logout(user.id);
    res.json({ message: 'Logged out successfully' });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile with roles' })
  async getProfile(@GetUser() user: any) {
    return this.authService.getUserProfile(user.id);
  }
}