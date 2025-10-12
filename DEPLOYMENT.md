# 🚀 Deployment Guide

Deploy Angular (Vercel) + NestJS (Render) - 100% Free!

---

## 📋 Architecture

```
Frontend → Vercel (Free)
Backend  → Render (Free 750h/month)
Storage  → Box.com (Free 10GB)
```

---

## 🆓 Part 1: Backend (Render.com)

### 1. Deploy
- Go to https://render.com
- Sign up with GitHub
- New → Web Service
- Connect: `duyan90/box-upload-app`
- Render auto-detects `render.yaml`
- Click "Create Web Service"

### 2. Set Environment Variables
Render Dashboard → Environment:

```bash
BOX_CLIENT_ID=f00lrhivgoesvo122aejdy7lrzuw0mka
BOX_CLIENT_SECRET=UZN7gGiVXL6hS8mRsDAjrgLGs9j5Ouw0
BOX_REDIRECT_URI=https://YOUR_RENDER_URL.onrender.com/api/box/callback
BOX_FOLDER_ID=345740672967
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
FRONTEND_LOGIN_URL=https://YOUR_VERCEL_URL.vercel.app/login
FRONTEND_DASHBOARD_URL=https://YOUR_VERCEL_URL.vercel.app/dashboard
PORT=3000
NODE_ENV=production
```

Save → Render redeploys (~3 min)

### 3. Get URL
Example: `https://box-upload-backend.onrender.com`

⚠️ **Note:** Free tier sleeps after 15 min. First request takes ~30s to wake up.

---

## ☁️ Part 2: Frontend (Vercel)

### 1. Update Config

**`frontend/src/environments/environment.prod.ts`:**
```typescript
backendUrl: 'https://YOUR_RENDER_URL.onrender.com'
redirectUri: 'https://YOUR_RENDER_URL.onrender.com/api/box/callback'
```

**`vercel.json`:**
```json
{
  "rewrites": [{
    "source": "/api/:path*",
    "destination": "https://YOUR_RENDER_URL.onrender.com/api/:path*"
  }]
}
```

Commit & push changes

### 2. Deploy
- https://vercel.com → Login with GitHub
- New Project → Import `duyan90/box-upload-app`
- Build: `npm run build:frontend`
- Output: `dist/frontend/browser`
- Deploy

### 3. Get URL
Example: `https://box-upload-app.vercel.app`

---

## 🔐 Part 3: Update Services

### Box.com
- https://app.box.com/developers/console
- OAuth Redirect URI: `https://YOUR_RENDER_URL.onrender.com/api/box/callback`

### Render
Update env vars with Vercel URL:
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

---

## 🐛 Issues

**Cold start slow:**
- Render free tier sleeps → first request ~30s

**CORS:**
- Update `backend/src/main.ts` with Vercel origin

**404:**
- Check `vercel.json` proxy to Render URL

---

## 💰 Cost

```
Render:  $0/month (750 hours free)
Vercel:  $0/month (unlimited)
Total:   $0/month 🎉
```

---

**Free tier, perfect for demo/portfolio! ✨**
