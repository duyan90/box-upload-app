/**
 * Development Environment Configuration
 * 
 * This file is used during development (npm run start:frontend)
 * Values here are committed to Git (no secrets!)
 */

export const environment = {
  production: false,
  
  // API Configuration
  api: {
    baseUrl: '/api', // Proxy to backend
    backendUrl: 'http://localhost:3000'
  },
  
  // Box OAuth Configuration
  box: {
    clientId: 'f00lrhivgoesvo122aejdy7lrzuw0mka', // Public - visible in browser anyway
    authUrl: 'https://account.box.com/api/oauth2/authorize',
    redirectUri: 'http://localhost:3000/api/box/callback',
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
    debugTools: true, // Show debug tools
    autoRefreshToken: true,
    duplicateHandling: true
  }
};

