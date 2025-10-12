/**
 * User Info DTO
 * User information structure from Box API
 */
export class UserInfoDto {
  id: string;
  type: string;
  name: string;
  login: string;
  created_at?: string;
  modified_at?: string;
  language?: string;
  timezone?: string;
  space_amount?: number;
  space_used?: number;
  max_upload_size?: number;
  status?: string;
  job_title?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

