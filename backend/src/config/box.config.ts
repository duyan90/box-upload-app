/**
 * Box API Configuration
 * 
 * ALL VALUES READ FROM ENVIRONMENT VARIABLES
 * NO HARDCODED SECRETS - Safe to commit to GitHub
 * 
 * Required environment variables (set in .env.local):
 * - BOX_CLIENT_ID
 * - BOX_CLIENT_SECRET
 * - BOX_REDIRECT_URI
 * - BOX_FOLDER_ID
 * 
 * See ENV-SETUP-GUIDE.md for setup instructions
 */

// Helper function to throw error if required env var is missing
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `Please create .env.local file in project root.\n` +
      `See ENV-SETUP-GUIDE.md for instructions.`
    );
  }
  return value;
}

export const BoxConfig = {
  // OAuth Credentials (REQUIRED - from .env.local)
  clientId: getRequiredEnv('BOX_CLIENT_ID'),
  clientSecret: getRequiredEnv('BOX_CLIENT_SECRET'),
  
  // OAuth URLs (public, safe to have defaults)
  authUrl: process.env['BOX_AUTH_URL'] || 'https://account.box.com/api/oauth2/authorize',
  tokenUrl: process.env['BOX_TOKEN_URL'] || 'https://api.box.com/oauth2/token',
  userInfoUrl: process.env['BOX_USER_INFO_URL'] || 'https://api.box.com/2.0/users/me',
  uploadUrl: process.env['BOX_UPLOAD_URL'] || 'https://upload.box.com/api/2.0/files/content',
  
  // Redirect URI (REQUIRED - from .env.local)
  redirectUri: getRequiredEnv('BOX_REDIRECT_URI'),
  
  // Folder Configuration (REQUIRED - from .env.local)
  folderId: getRequiredEnv('BOX_FOLDER_ID'),
  
  // Frontend URLs
  frontend: {
    baseUrl: process.env['FRONTEND_URL'] || 'http://localhost:4200',
    loginUrl: process.env['FRONTEND_LOGIN_URL'] || 'http://localhost:4200/login',
    dashboardUrl: process.env['FRONTEND_DASHBOARD_URL'] || 'http://localhost:4200/dashboard',
  },
  
  // Upload Limits
  upload: {
    maxFileSize: parseInt(process.env['MAX_FILE_SIZE'] || '104857600'), // 100MB
    maxFiles: parseInt(process.env['MAX_FILES'] || '5'),
  }
};

