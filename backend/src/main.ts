/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables in order of priority:
// 1. System environment (Railway/Vercel/etc) - highest priority
// 2. .env.local (local development) - overrides .env
// 3. .env (shared defaults) - lowest priority

const envLocal = path.join(__dirname, '../../.env.local');
const envDefault = path.join(__dirname, '../../.env');

// Debug: Log paths and check if files exist
console.log('🔍 Loading environment variables...');
console.log('📂 __dirname:', __dirname);
console.log('📄 .env.local path:', envLocal);
console.log('📄 .env path:', envDefault);
console.log('✅ .env.local exists:', fs.existsSync(envLocal));
console.log('✅ .env exists:', fs.existsSync(envDefault));

// Load .env first (if exists)
const envResult = dotenv.config({ path: envDefault });
if (envResult.error) {
  console.log('⚠️  .env not loaded:', envResult.error.message);
}

// Then load .env.local (overrides .env, if exists)
const envLocalResult = dotenv.config({ path: envLocal });
if (envLocalResult.error) {
  console.log('⚠️  .env.local not loaded:', envLocalResult.error.message);
} else {
  console.log('✅ .env.local loaded successfully');
}

// Log BOX credentials (first 10 chars only for security)
console.log('🔐 BOX_CLIENT_ID:', process.env.BOX_CLIENT_ID?.substring(0, 10) + '...');
console.log('🔐 BOX_CLIENT_SECRET:', process.env.BOX_CLIENT_SECRET ? '***SET***' : '❌ NOT SET');

// System environment variables automatically override everything
// This allows Railway/Vercel to set variables without .env files

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
