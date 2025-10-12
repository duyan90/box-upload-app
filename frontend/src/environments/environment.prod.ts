/**
 * Production Environment Configuration
 * 
 * This file is used during production builds (npm run build:frontend)
 * Update these values before deploying to production
 */

export const environment = {
  production: true,
  
  // API Configuration
  api: {
    baseUrl: '/api', // Proxied by Vercel to backend
    backendUrl: 'https://box-upload-backend.onrender.com'
  },
  
  // Box OAuth Configuration
  box: {
    clientId: 'f00lrhivgoesvo122aejdy7lrzuw0mka',
    authUrl: 'https://account.box.com/api/oauth2/authorize',
    redirectUri: 'https://box-upload-backend.onrender.com/api/box/callback',
    folderId: '345740672967'
  },
  
  // Upload Limits
  upload: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 5,
    allowedTypes: ['image/*', '.pdf', '.doc', '.docx', '.txt', '.mp4', '.avi', '.mov']
  },
  
  // Feature Flags
  features: {
    debugTools: false, // Hide debug tools in production
    autoRefreshToken: true,
    duplicateHandling: true
  }
};

