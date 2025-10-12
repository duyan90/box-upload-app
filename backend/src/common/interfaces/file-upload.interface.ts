/**
 * File Upload Interface
 * 
 * Represents a file uploaded via Multer
 */
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * Upload Request DTO
 * 
 * Request body for upload endpoints
 */
export interface UploadRequestDto {
  accessToken: string;
}

