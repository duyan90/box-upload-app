/**
 * Token Response DTO
 * Response structure from Box OAuth token endpoint
 */
export class TokenResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  restricted_to?: any[];
  issued_token_type?: string;
}

