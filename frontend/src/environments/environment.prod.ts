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
    backendUrl: 'https://your-railway-app.railway.app' // Update with your Railway URL
  },
  
  // Box OAuth Configuration
  // ⚠️  UPDATE backendUrl and redirectUri with your Railway URL before deploying!
  box: {
    clientId: 'f00lrhivgoesvo122aejdy7lrzuw0mka', // Public - same as dev
    authUrl: 'https://account.box.com/api/oauth2/authorize',
    redirectUri: 'https://your-railway-app.railway.app/api/box/callback', // Update with your Railway URL
    folderId: '345740672967' // Your Box folder ID
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

