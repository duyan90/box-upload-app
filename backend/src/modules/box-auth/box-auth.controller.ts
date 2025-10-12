import { Controller, Get, Post, Body, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BoxAuthService } from './box-auth.service';
import { BoxConfig } from '../../config/box.config';

interface BoxCallbackDto {
  code: string;
}

@Controller('box')
export class BoxAuthController {
  constructor(private readonly boxAuthService: BoxAuthService) {}

  /**
   * Handle Box OAuth callback (GET request from Box)
   * GET /api/auth/box/callback?code=xxx&state=xxx
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Res() res: Response
  ) {
    try {
      // Check for error from Box
      if (error) {
        console.error('Box OAuth error:', error);
        return res.redirect(`${BoxConfig.frontend.loginUrl}?error=${encodeURIComponent(error)}`);
      }

      if (!code) {
        throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
      }

      console.log('Received authorization code:', code);
      console.log('State:', state);

      // Exchange code for token
      const tokenData = await this.boxAuthService.exchangeCodeForToken(code);

      console.log('Token exchange successful');

      // Get user info
      const userInfo = await this.boxAuthService.getUserInfo(tokenData.access_token);

      console.log('User info:', userInfo);

      // In production, you would:
      // 1. Create session
      // 2. Store tokens securely
      // 3. Set secure cookie
      
      // For now, redirect to frontend with token in URL (NOT SECURE for production!)
      const params = new URLSearchParams({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        user_id: userInfo.id,
        user_name: userInfo.name,
      });

      return res.redirect(`${BoxConfig.frontend.dashboardUrl}?${params.toString()}`);
    } catch (error) {
      console.error('Box OAuth error:', error);
      return res.redirect(`${BoxConfig.frontend.loginUrl}?error=auth_failed`);
    }
  }

  /**
   * Exchange authorization code for token (POST endpoint for manual use)
   * POST /api/auth/box/token
   */
  @Post('token')
  async exchangeToken(@Body() body: BoxCallbackDto) {
    try {
      const { code } = body;

      if (!code) {
        throw new HttpException('Authorization code is required', HttpStatus.BAD_REQUEST);
      }

      // Exchange code for token
      const tokenData = await this.boxAuthService.exchangeCodeForToken(code);

      return {
        success: true,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
      };
    } catch (error) {
      console.error('Box OAuth error:', error);
      throw new HttpException(
        'Failed to authenticate with Box',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Refresh Box access token
   * POST /api/auth/box/refresh
   */
  @Post('refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    try {
      const { refresh_token } = body;

      if (!refresh_token) {
        throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
      }

      const tokenData = await this.boxAuthService.refreshAccessToken(refresh_token);

      return {
        success: true,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new HttpException(
        'Failed to refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get user info from Box
   * POST /api/auth/box/user
   */
  @Post('user')
  async getUserInfo(@Body() body: { access_token: string }) {
    try {
      const { access_token } = body;

      if (!access_token) {
        throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
      }

      const userInfo = await this.boxAuthService.getUserInfo(access_token);

      return {
        success: true,
        user: userInfo,
      };
    } catch (error) {
      console.error('Get user info error:', error);
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

