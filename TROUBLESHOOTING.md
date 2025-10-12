# 🐛 Troubleshooting

---

## 🔧 Local Development

### Backend won't start
**Error:** `Missing required environment variable`
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
npm run start:backend
```

### CORS errors
Check `backend/src/main.ts`:
```typescript
app.enableCors({ origin: '*' });
```

### Port in use
```bash
lsof -ti:3000 | xargs kill -9
# Or change PORT in .env.local
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔐 Authentication

### OAuth redirect error
**Error:** `redirect_uri_mismatch`
- Box Console → Add: `http://localhost:3000/api/box/callback`
- Restart backend

### Token expired (401)
- Click "Refresh Token" in dashboard
- Or logout/login again

### Login loop
Check `auth.guard.ts` allows URL params:
```typescript
if (route.queryParams['access_token']) return true;
```

---

## 📤 Upload

### Upload fails (403)
- Box app needs "Write all files" scope
- Reauthorize app (logout/login)

### File size limit
Update `.env.local`:
```bash
MAX_FILE_SIZE=209715200  # 200MB
```

And `environment.ts`:
```typescript
maxFileSize: 200 * 1024 * 1024
```

---

## 🚀 Deployment

### Railway build fails
Check `railway.json`:
```json
{
  "build": {
    "buildCommand": "npm install && npm run build:backend"
  }
}
```

### Vercel build fails
Check build settings:
- Build: `npm run build:frontend`
- Output: `dist/frontend/browser`

### Env vars not working
- **Railway:** Variables tab → Restart
- **Vercel:** Update `environment.prod.ts` → Commit

### 404 on /api
Check `vercel.json` proxy to Railway URL

---

## 🔍 Debug

**Backend logs:**
```bash
# Local
npm run start:backend

# Railway
Dashboard → View Logs
```

**Frontend:**
```
Browser → F12 → Console/Network
```

**Check env:**
```bash
cat .env.local
git check-ignore .env.local
```

---

**Most issues = config. Check environment variables first!**
