# ⚡ Quick Start Guide

Get the app running in 5 minutes.

---

## 📋 **Prerequisites**

- Node.js 18+
- npm
- Box.com account

---

## 🚀 **Setup (5 minutes)**

### **1. Clone & Install**

```bash
git clone <your-repo-url>
cd my-fullstack-app
npm install
```

### **2. Create Box OAuth App**

1. Go to https://app.box.com/developers/console
2. Click "Create New App" → "Custom App" → "Standard OAuth 2.0"
3. Name your app
4. **Configuration tab:**
   - OAuth 2.0 Redirect URI: `http://localhost:3000/api/box/callback`
   - Application Scopes:
     - ✅ Read all files and folders
     - ✅ Write all files and folders
   - Click "Save Changes"
5. Copy **Client ID** and **Client Secret**

### **3. Configure Environment**

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local
code .env.local
```

**Update these values:**
```bash
BOX_CLIENT_ID=your_client_id_here
BOX_CLIENT_SECRET=your_client_secret_here
BOX_REDIRECT_URI=http://localhost:3000/api/box/callback
BOX_FOLDER_ID=0
```

### **4. Start App**

```bash
# Start both backend and frontend
npm run start

# Or separately:
npm run start:backend  # Port 3000
npm run start:frontend # Port 4200
```

### **5. Open Browser**

```
http://localhost:4200
```

1. Click "Login with Box"
2. Authorize on Box.com
3. Upload files!

---

## 📝 **Common Commands**

```bash
# Development
npm run start              # Start both
npm run start:backend      # Backend only
npm run start:frontend     # Frontend only

# Build
npm run build             # Build both
npm run build:backend     # Backend only
npm run build:frontend    # Frontend only

# Clean
npm run clean             # Clear caches
```

---

## 🐛 **Troubleshooting**

### **Backend won't start:**
```bash
# Check .env.local exists and has correct values
cat .env.local
```

### **CORS errors:**
Check `backend/src/main.ts` has `app.enableCors()`

### **OAuth redirect error:**
Verify Box redirect URI: `http://localhost:3000/api/box/callback`

**More issues?** See `TROUBLESHOOTING.md`

---

## 📚 **Next Steps**

- **Deploy:** See `DEPLOYMENT.md`
- **Code structure:** See `CODE-STRUCTURE.md`
- **Issues:** See `TROUBLESHOOTING.md`

---

**You're ready to go! 🎉**
