/**
 * File List Request DTO
 * Request body for listing files in a folder
 */
export class FileListRequestDto {
  accessToken: string;
  folderId?: string;
  limit?: number;
  offset?: number;
}

