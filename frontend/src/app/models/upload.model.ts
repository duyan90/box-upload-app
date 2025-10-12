/**
 * Upload Models
 */

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

export interface UploadConfig {
  maxFileSize: number;
  maxFiles: number;
  allowedTypes: string[];
}

export interface UploadResult {
  success: boolean;
  fileName: string;
  fileId?: string;
  error?: string;
}

