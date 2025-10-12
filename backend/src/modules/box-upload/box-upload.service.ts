import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { BoxConfig } from '../../config/box.config';
const FormData = require('form-data');

/**
 * Box Upload Service
 * 
 * Handles all Box.com file upload operations including:
 * - Single file upload
 * - Multiple files upload
 * - Duplicate file handling (auto-version or rename)
 * - List files in folder
 * - Folder info retrieval
 */

interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface BoxUploadResponse {
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

@Injectable()
export class BoxUploadService {
  private readonly uploadUrl = BoxConfig.uploadUrl;
  private readonly folderId = BoxConfig.folderId;

  /**
   * Upload file to Box folder
   */
  async uploadFile(accessToken: string, file: FileUpload): Promise<BoxUploadResponse> {
    try {
      // Create Node.js FormData for multipart upload
      const formData = new FormData();
      
      // Box API requires 'attributes' field as JSON string
      const attributes = JSON.stringify({
        name: file.originalname,
        parent: {
          id: this.folderId
        }
      });
      
      // Add attributes first (Box API requirement)
      formData.append('attributes', attributes);
      
      // Add file using Buffer directly
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      console.log('Uploading to Box:', {
        url: this.uploadUrl,
        folderId: this.folderId,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      });

      const response = await axios.post<BoxUploadResponse>(
        this.uploadUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...formData.getHeaders(),
          },
        }
      );

      console.log('✅ Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Box upload error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        uploadUrl: this.uploadUrl,
        folderId: this.folderId,
        filename: file.originalname,
      });
      
      // Handle specific Box API errors
      if (error.response?.status === 403) {
        throw new HttpException(
          `Access denied to folder ${this.folderId}. Error: ${JSON.stringify(error.response?.data)}`,
          HttpStatus.FORBIDDEN
        );
      } else if (error.response?.status === 401) {
        throw new HttpException(
          `Authentication failed. Token may be expired. Error: ${JSON.stringify(error.response?.data)}`,
          HttpStatus.UNAUTHORIZED
        );
      } else if (error.response?.status === 400) {
        throw new HttpException(
          `Bad request. Error: ${JSON.stringify(error.response?.data)}`,
          HttpStatus.BAD_REQUEST
        );
      } else if (error.response?.status === 409) {
        // File already exists - try to upload new version
        console.log('⚠️  File already exists, uploading new version...');
        return await this.uploadNewVersion(accessToken, file, error.response?.data);
      }
      
      throw new HttpException(
        `Box upload failed: ${error.response?.data?.message || error.response?.data?.error_description || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Upload new version of existing file
   */
  private async uploadNewVersion(accessToken: string, file: FileUpload, conflictData: any): Promise<BoxUploadResponse> {
    try {
      // Extract file ID from conflict response
      const existingFileId = conflictData?.context_info?.conflicts?.id;
      
      if (!existingFileId) {
        // If we can't get file ID, add timestamp to filename and retry
        const timestamp = Date.now();
        const nameParts = file.originalname.split('.');
        const ext = nameParts.pop();
        const baseName = nameParts.join('.');
        const newFileName = `${baseName}_${timestamp}.${ext}`;
        
        console.log(`📝 Renaming file to: ${newFileName}`);
        
        const formData = new FormData();
        const attributes = JSON.stringify({
          name: newFileName,
          parent: {
            id: this.folderId
          }
        });
        
        formData.append('attributes', attributes);
        formData.append('file', file.buffer, {
          filename: newFileName,
          contentType: file.mimetype,
        });

        const response = await axios.post<BoxUploadResponse>(
          this.uploadUrl,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              ...formData.getHeaders(),
            },
          }
        );

        console.log('✅ Upload with new name successful:', response.data);
        return response.data;
      }

      // Upload new version to existing file
      const versionUrl = `https://upload.box.com/api/2.0/files/${existingFileId}/content`;
      
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      console.log(`🔄 Uploading new version to file ID: ${existingFileId}`);

      const response = await axios.post<BoxUploadResponse>(
        versionUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            ...formData.getHeaders(),
          },
        }
      );

      console.log('✅ New version uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload new version:', error.message);
      throw new HttpException(
        `Failed to handle duplicate file: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Upload multiple files to Box folder
   */
  async uploadFiles(accessToken: string, files: FileUpload[]): Promise<BoxUploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(accessToken, file));
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Box batch upload error:', error);
      throw new HttpException(
        'Failed to upload files to Box',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get folder info
   */
  async getFolderInfo(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.box.com/2.0/folders/${this.folderId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Box folder info error:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to get folder info',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get list of files in folder
   */
  async getFiles(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.box.com/2.0/folders/${this.folderId}/items`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          params: {
            fields: 'id,name,size,modified_at,created_at,file_version,etag,sequence_id,created_by,modified_by',
            limit: 100,
            sort: 'date',
            direction: 'DESC'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Box get files error:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to get files list',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Test if access token is valid
   */
  async testToken(accessToken: string): Promise<any> {
    try {
      const response = await axios.get('https://api.box.com/2.0/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return {
        valid: true,
        user: response.data,
        tokenPreview: accessToken.substring(0, 20) + '...',
      };
    } catch (error) {
      console.error('Token test error:', error.response?.data || error.message);
      return {
        valid: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  }
}
