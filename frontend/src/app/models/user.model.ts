/**
 * User Model
 * Represents a Box user
 */
export interface User {
  id: string;
  type: string;
  name: string;
  login: string;
  created_at?: string;
  modified_at?: string;
  avatar_url?: string;
}

