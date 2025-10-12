import { Injectable } from '@nestjs/common';
import { BoxConfig } from '../../config/box.config';

interface BoxTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface BoxUserInfo {
  id: string;
  name: string;
  login: string;
  type: string;
}

@Injectable()
export class BoxAuthService {
  // Box OAuth Configuration (from config file)
  private readonly clientId = BoxConfig.clientId;
  private readonly clientSecret = BoxConfig.clientSecret;
  private readonly redirectUri = BoxConfig.redirectUri;
  private readonly tokenUrl = BoxConfig.tokenUrl;
  private readonly userInfoUrl = BoxConfig.userInfoUrl;

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<BoxTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Box token exchange failed:', error);
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<BoxTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token refresh failed:', error);
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get user information from Box API
   */
  async getUserInfo(accessToken: string): Promise<BoxUserInfo> {
    const response = await fetch(this.userInfoUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Get user info failed:', error);
      throw new Error(`Get user info failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Revoke access token
   */
  async revokeToken(accessToken: string): Promise<void> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      token: accessToken,
    });

    const response = await fetch('https://api.box.com/oauth2/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token revocation failed:', error);
      throw new Error(`Token revocation failed: ${response.statusText}`);
    }
  }
}

