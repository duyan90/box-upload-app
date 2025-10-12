# 🏗️ Code Structure

---

## 📁 Backend (NestJS)

```
backend/src/
├── app/                    # Root module
├── modules/                # Features
│   ├── box-auth/           # OAuth
│   │   ├── dto/            # Request/response types
│   │   ├── *.controller.ts
│   │   ├── *.service.ts
│   │   └── *.module.ts
│   └── box-upload/         # File upload
│       └── (same structure)
├── config/
│   └── box.config.ts       # Env vars config
├── common/
│   └── interfaces/         # Shared types
└── main.ts                 # Entry point (loads .env.local)
```

**Key Points:**
- Feature modules (box-auth, box-upload)
- DTOs for type safety
- Config from environment variables
- No hardcoded secrets

---

## 🎨 Frontend (Angular)

```
frontend/src/app/
├── components/             # UI
│   ├── login.component.ts
│   └── dashboard.component.*
├── services/
│   └── api.service.ts      # HTTP calls
├── guards/
│   └── auth.guard.ts       # Route protection
├── models/                 # TypeScript types
│   ├── user.model.ts
│   ├── box-file.model.ts
│   └── *.model.ts
├── shared/
│   ├── utils/              # Helpers
│   │   ├── file.utils.ts
│   │   └── string.utils.ts
│   └── constants/          # Config
│       ├── storage.constants.ts
│       └── api.constants.ts
└── environments/           # Config per env
    ├── environment.ts      # Dev
    └── environment.prod.ts # Prod
```

**Key Points:**
- Components for UI
- Services for logic
- Models for types
- Guards for routes
- Shared utilities

---

## 🔄 Data Flow

```
User → Component → Service → HttpClient
     → Backend Controller → Service → Box API
```

**Auth Flow:**
```
Login → Box OAuth → Callback → Save tokens
     → Dashboard (protected by AuthGuard)
```

---

## 🎯 Design Patterns

**Backend:**
- Module pattern (feature modules)
- Dependency injection
- DTO pattern

**Frontend:**
- Component-Service pattern
- Guard pattern
- Utility functions
- Constants

---

## 📏 Naming

| Type | Pattern | Example |
|------|---------|---------|
| Component | `*.component.ts` | `login.component.ts` |
| Service | `*.service.ts` | `api.service.ts` |
| Guard | `*.guard.ts` | `auth.guard.ts` |
| Model | `*.model.ts` | `user.model.ts` |
| DTO | `*.dto.ts` | `upload-request.dto.ts` |

---

## 🔐 Environment Variables

**Backend:** All from `process.env` (loaded by dotenv)
**Frontend:** Build-time from `environment.ts`

**Local:** `.env.local` → Backend
**Production:** Railway/Vercel dashboards

---

**Clean, organized, production-ready! ✅**
