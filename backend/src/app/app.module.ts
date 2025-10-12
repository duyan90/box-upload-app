import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoxAuthModule } from '../modules/box-auth/box-auth.module';
import { BoxUploadModule } from '../modules/box-upload/box-upload.module';

/**
 * Root Application Module
 * 
 * Imports feature modules:
 * - BoxAuthModule: Handles OAuth authentication
 * - BoxUploadModule: Handles file uploads
 */
@Module({
  imports: [
    BoxAuthModule,    // Box OAuth authentication
    BoxUploadModule,  // Box file upload
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
