/**
 * Box API Response Interfaces
 */

export interface BoxTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface BoxUserInfo {
  id: string;
  name: string;
  login: string;
  type: string;
}

export interface BoxUploadResponse {
  entries?: Array<{
    type: string;
    id: string;
    name: string;
    size: number;
    created_at: string;
    modified_at: string;
  }>;
  total_count?: number;
  // Single file response
  type?: string;
  id?: string;
  name?: string;
  size?: number;
  created_at?: string;
  modified_at?: string;
}

