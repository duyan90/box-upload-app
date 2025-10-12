import { Controller, Post, UseInterceptors, UploadedFiles, Body, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BoxUploadService } from './box-upload.service';
import { UploadRequestDto } from './dto';
import { FileUpload } from '../../common/interfaces';

/**
 * Box Upload Controller
 * 
 * Handles file upload operations to Box.com
 */

@Controller('box/upload')
export class BoxUploadController {
  constructor(private readonly boxUploadService: BoxUploadService) {}

  /**
   * Upload single file to Box folder
   */
  @Post('file')
  @UseInterceptors(FilesInterceptor('file', 1))
  async uploadFile(
    @UploadedFiles() files: FileUpload[],
    @Body() body: UploadRequestDto
  ) {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
      }

      if (!body.accessToken) {
        throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.boxUploadService.uploadFile(body.accessToken, files[0]);
      
      return {
        success: true,
        message: 'File uploaded successfully',
        file: result,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new HttpException(
        error.message || 'Upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Upload multiple files to Box folder
   */
  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 5)) // Max 5 files
  async uploadFiles(
    @UploadedFiles() files: FileUpload[],
    @Body() body: UploadRequestDto
  ) {
    try {
      if (!files || files.length === 0) {
        throw new HttpException('No files provided', HttpStatus.BAD_REQUEST);
      }

      if (!body.accessToken) {
        throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
      }

      // Log file details
      console.log(`📦 Uploading ${files.length} file(s):`);
      files.forEach((file, index) => {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        console.log(`  ${index + 1}. ${file.originalname} (${sizeMB} MB)`);
      });

      const results = await this.boxUploadService.uploadFiles(body.accessToken, files);
      
      return {
        success: true,
        message: `${files.length} files uploaded successfully`,
        files: results,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new HttpException(
        error.message || 'Upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get folder info
   */
  @Post('folder-info')
  async getFolderInfo(@Body() body: UploadRequestDto) {
    try {
      if (!body.accessToken) {
        throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
      }

      const folderInfo = await this.boxUploadService.getFolderInfo(body.accessToken);
      
      return {
        success: true,
        folder: folderInfo,
      };
    } catch (error) {
      console.error('Folder info error:', error);
      throw new HttpException(
        error.message || 'Failed to get folder info',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Test access token validity
   */
  @Post('test-token')
  async testToken(@Body() body: UploadRequestDto) {
    try {
      if (!body.accessToken) {
        throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
      }

      const tokenTest = await this.boxUploadService.testToken(body.accessToken);
      
      return {
        success: true,
        tokenTest,
      };
    } catch (error) {
      console.error('Token test error:', error);
      throw new HttpException(
        error.message || 'Failed to test token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get list of uploaded files
   */
  @Post('list-files')
  async listFiles(@Body() body: UploadRequestDto) {
    try {
      if (!body.accessToken) {
        throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
      }

      const files = await this.boxUploadService.getFiles(body.accessToken);
      
      return {
        success: true,
        files: files.entries || [],
        total: files.total_count || 0,
      };
    } catch (error) {
      console.error('List files error:', error);
      throw new HttpException(
        error.message || 'Failed to list files',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
