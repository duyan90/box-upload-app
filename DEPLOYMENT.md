# 🚀 Deployment Guide

Deploy Angular (Vercel) + NestJS (Railway) in ~30 minutes.

---

## 🚂 Part 1: Backend (Railway)

### 1. Create Account & Deploy
- Go to https://railway.app → Login with GitHub
- New Project → Deploy from GitHub repo
- Select your repository

### 2. Set Environment Variables
Railway Dashboard → Variables → Add:

```bash
BOX_CLIENT_ID=your_client_id
BOX_CLIENT_SECRET=your_client_secret
BOX_REDIRECT_URI=https://YOUR_RAILWAY_URL.railway.app/api/box/callback
BOX_FOLDER_ID=your_folder_id_or_0
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
FRONTEND_LOGIN_URL=https://YOUR_VERCEL_URL.vercel.app/login
FRONTEND_DASHBOARD_URL=https://YOUR_VERCEL_URL.vercel.app/dashboard
PORT=3000
NODE_ENV=production
```

### 3. Save Railway URL
Example: `https://your-app-abc123.railway.app`

---

## ☁️ Part 2: Frontend (Vercel)

### 1. Update Config Files

**`frontend/src/environments/environment.prod.ts`:**
```typescript
backendUrl: 'https://YOUR_RAILWAY_URL.railway.app'
clientId: 'YOUR_BOX_CLIENT_ID'
redirectUri: 'https://YOUR_RAILWAY_URL.railway.app/api/box/callback'
```

**`vercel.json`:**
```json
{
  "rewrites": [{
    "source": "/api/:path*",
    "destination": "https://YOUR_RAILWAY_URL.railway.app/api/:path*"
  }]
}
```

Commit changes: `git push`

### 2. Deploy to Vercel
- https://vercel.com → Login with GitHub
- New Project → Import your repo
- Build settings:
  - Build Command: `npm run build:frontend`
  - Output Directory: `dist/frontend/browser`
- Deploy

### 3. Save Vercel URL
Example: `https://your-project-xyz.vercel.app`

---

## 🔐 Part 3: Update Box & Railway

### Box.com
- https://app.box.com/developers/console → Your App
- OAuth Redirect URI: `https://YOUR_RAILWAY_URL.railway.app/api/box/callback`
- Save

### Railway
Update variables with Vercel URL:
```bash
FRONTEND_URL=https://your-vercel-url.vercel.app
FRONTEND_LOGIN_URL=https://your-vercel-url.vercel.app/login
FRONTEND_DASHBOARD_URL=https://your-vercel-url.vercel.app/dashboard
```

---

## ✅ Test

1. Open: `https://your-vercel-url.vercel.app`
2. Login with Box
3. Upload file
4. Check Box.com folder

---

## 🐛 Common Issues

**CORS Error:**
- Update `backend/src/main.ts` with Vercel origin

**404 on /api:**
- Check `vercel.json` rewrites

**OAuth Error:**
- Verify Box redirect URI matches Railway URL

**Env vars not working:**
- Railway: Check Variables tab, redeploy
- Vercel: Update `environment.prod.ts`, commit

---

## 💰 Cost

```
Vercel:   $0/month (free)
Railway:  $0/month ($5 credit)
Total:    $0/month
```

---

**Done! Your app is live! 🎉**
