/**
 * Box File Model
 * Represents a file stored in Box
 */
export interface BoxFile {
  id: string;
  type: string;
  name: string;
  size: number;
  created_at: string;
  modified_at: string;
  etag?: string;
  sequence_id?: string;
  file_version?: {
    id: string;
    type: string;
    sha1: string;
    version_number: string;
  };
  created_by?: {
    id: string;
    type: string;
    name: string;
    login: string;
  };
  modified_by?: {
    id: string;
    type: string;
    name: string;
    login: string;
  };
}

/**
 * Box File List Response
 */
export interface BoxFileListResponse {
  entries: BoxFile[];
  total_count: number;
  offset: number;
  limit: number;
}

