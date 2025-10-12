# 🔐 Security Guide

## ⚠️ NEVER Commit Secrets to Git!

---

## ✅ Safe to Commit (Public Values)

```bash
# BOX_CLIENT_ID - Public (visible in browser anyway)
BOX_CLIENT_ID=f00lrhivgoesvo122aejdy7lrzuw0mka  # ✅ OK

# BOX_FOLDER_ID - Public (users need to know where files go)
BOX_FOLDER_ID=345740672967  # ✅ OK

# Public URLs
https://account.box.com/api/oauth2/authorize  # ✅ OK
http://localhost:3000/api/box/callback  # ✅ OK
```

---

## ❌ NEVER Commit (Secret Values)

```bash
# BOX_CLIENT_SECRET - THIS IS SECRET!
BOX_CLIENT_SECRET=your_secret_key_here  # ❌ SECRET!

# .env.local file (contains secrets)
.env.local  # ❌ GITIGNORED

# Access tokens
box_access_token  # ❌ SECRET

# Refresh tokens
box_refresh_token  # ❌ SECRET
```

---

## 🔐 What's Secret vs Public

**PUBLIC (OK to commit):**
- `BOX_CLIENT_ID` - Visible in browser OAuth flow anyway
- `BOX_FOLDER_ID` - Just a folder reference
- `BOX_AUTH_URL` - Public Box API endpoint
- `BOX_REDIRECT_URI` - Public callback URL

**SECRET (NEVER commit):**
- `BOX_CLIENT_SECRET` - Used to authenticate your app
- Access tokens - User session tokens
- Refresh tokens - Token refresh credentials

---

## 📁 Where Secrets Live

**Local:** `.env.local` (gitignored)
**Production:** Railway/Vercel dashboard
**NEVER:** In Git repository

---

## 🔍 Check for Secrets Before Commit

```bash
# Quick scan
git diff --cached | grep -i "client_secret\|UZN7\|f00l"

# Full scan
git ls-files | xargs grep -i "your_real_secret"

# Check .gitignore
git check-ignore .env.local
# Should output: .env.local
```

---

## 🚨 If You Committed Secrets

1. **IMMEDIATELY** revoke credentials (Box Developer Console)
2. Remove from code
3. Generate new credentials
4. Update `.env.local` (local) and Railway/Vercel (prod)
5. **Never commit again**

---

## 🛡️ Best Practices

- Use different credentials for dev/prod
- Rotate secrets every 3-6 months
- Set via `.env.local` (local) or platform dashboard (prod)
- Review `git diff` before every commit
- When in doubt: Don't commit it!

---

## ✅ Current Status

All secrets removed from:
- ✅ Documentation files
- ✅ Source code
- ✅ Environment templates

Secrets only in:
- ✅ `.env.local` (gitignored)
- ✅ Railway/Vercel variables

**Safe to push to GitHub! 🎉**
