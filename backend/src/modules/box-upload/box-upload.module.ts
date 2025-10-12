import { Module } from '@nestjs/common';
import { BoxUploadController } from './box-upload.controller';
import { BoxUploadService } from './box-upload.service';

/**
 * Box Upload Module
 * 
 * Handles file upload to Box:
 * - Single file upload
 * - Multiple files upload
 * - Duplicate file handling (versioning)
 * - List uploaded files
 * - Folder info
 */
@Module({
  controllers: [BoxUploadController],
  providers: [BoxUploadService],
  exports: [BoxUploadService], // Export for use in other modules
})
export class BoxUploadModule {}

