import { Module } from '@nestjs/common';
import { BoxAuthController } from './box-auth.controller';
import { BoxAuthService } from './box-auth.service';

/**
 * Box Authentication Module
 * 
 * Handles Box OAuth 2.0 authentication flow:
 * - OAuth callback
 * - Token exchange
 * - Token refresh
 * - User info retrieval
 */
@Module({
  controllers: [BoxAuthController],
  providers: [BoxAuthService],
  exports: [BoxAuthService], // Export for use in other modules
})
export class BoxAuthModule {}

