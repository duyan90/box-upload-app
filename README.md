# Box File Upload Application

Angular + NestJS fullstack app for uploading files to Box.com with OAuth authentication.

> 🚀 **First time?** See [QUICK-START.md](./QUICK-START.md) - Setup in 5 minutes!
> 📚 **All docs:** See [DOCS.md](./DOCS.md)

## 🚀 Project Structure

```
my-fullstack-app/
├── frontend/                # Angular application
│   ├── src/
│   │   ├── app/            # Application components
│   │   ├── styles.css      # Global styles with Tailwind
│   │   └── main.ts         # Application entry point
│   └── project.json        # Frontend project configuration
├── backend/                 # NestJS application
│   ├── src/
│   │   └── main.ts         # Backend entry point
│   └── project.json        # Backend project configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── .vscode/
    └── launch.json         # Debug configuration
```

## 🛠️ Technologies

### Frontend
- **Angular 20** - Modern web framework with standalone components
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming with observables
- **Jest** - Testing framework

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Express** - HTTP server (under NestJS)
- **Jest** - Testing framework

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🚀 Running the Application

> 💡 **Quick Start:** See [QUICK-START.md](./QUICK-START.md) for detailed guide

### Option 1: Run Everything (Recommended) ⚡

```bash
npm start
```

This starts both frontend (port 4200) and backend (port 3000) in parallel.

### Option 2: Run Individually

```bash
# Backend only
npm run start:backend   # or npm run start:api

# Frontend only  
npm run start:frontend  # or npm run start:web
```

### Option 3: Using Nx Directly

```bash
# Development mode - Frontend
npx nx serve frontend
# → Available at http://localhost:4200

# Development mode - Backend
npx nx serve backend
# → Available at http://localhost:3000/api

# Run both in parallel
npx nx run-many -t serve -p frontend backend --parallel
```

## 🐛 Debugging the NestJS Backend

The project includes a pre-configured debug setup for VS Code.

### Debug Steps:

1. Open the project in VS Code
2. Go to the Debug panel (Ctrl+Shift+D or Cmd+Shift+D)
3. Select **"Debug NestJS Backend"** from the dropdown
4. Press F5 or click the green play button

The debugger will:
- Start the NestJS backend server with Webpack watch mode
- Attach the debugger on port 9229
- Allow you to set breakpoints in your TypeScript code
- Show variables and call stacks during execution
- Hot reload on file changes

### Setting Breakpoints:

1. Open any `.ts` file in the `backend/src` directory
2. Click on the left margin (line number area) to set a breakpoint (red dot)
3. The debugger will pause execution when that line is reached
4. Use the debug toolbar to step through code, inspect variables, etc.

### Debug Console:

You can also use the Debug Console to evaluate expressions and run commands while debugging.

## 🎨 Tailwind CSS

This project uses **Tailwind CSS v3** for styling.

### Quick Start:
Simply use Tailwind classes in your Angular templates:

```html
<div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:shadow-xl">
  Hello Tailwind!
</div>
```

### Configuration Files:
- `postcss.config.js` - PostCSS configuration with Tailwind
- `tailwind.config.js` - Theme and content configuration
- `frontend/src/styles.css` - Tailwind directives

## 📁 Project Commands

### Build

```bash
# Build all
npm run build

# Build individually
npm run build:frontend
npm run build:backend

# Using Nx directly
npx nx build frontend
npx nx build backend
npx nx run-many -t build
```

### Test

```bash
# Test all
npm test

# Test individually
npm run test:frontend
npm run test:backend

# Using Nx directly
npx nx test frontend
npx nx test backend
npx nx run-many -t test
```

### Lint

```bash
# Lint all
npm run lint

# Lint individually
npm run lint:frontend
npm run lint:backend

# Using Nx directly
npx nx lint frontend
npx nx lint backend
npx nx run-many -t lint
```

### Format Code

```bash
# Format all code
npm run format

# Check formatting
npm run format:check
```

## 🌐 API Endpoints

The NestJS backend provides the following REST API endpoints (all prefixed with `/api`):

- `GET /api` - Health check endpoint
  - Returns: `{ message: "Hello API" }`

- `GET /api/users` - Get list of users
  - Returns: `{ users: [{ id, name, email }] }`

### NestJS Architecture:

The backend follows NestJS best practices:
- **Controllers** (`backend/src/app/app.controller.ts`) - Handle HTTP requests
- **Services** (`backend/src/app/app.service.ts`) - Business logic
- **Modules** (`backend/src/app/app.module.ts`) - Organize application structure

## 🔌 Frontend-Backend Communication

The frontend communicates with the backend using:

1. **Proxy Configuration** - `frontend/proxy.conf.json` routes `/api/*` to backend
2. **CORS Enabled** - Backend allows all origins during development
3. **API Service** - Centralized HTTP client in `frontend/src/app/services/api.service.ts`
4. **Type-Safe** - TypeScript interfaces for requests/responses

Example:
```typescript
// Using the API service
this.apiService.getUsers()
  .subscribe(response => {
    this.users = response.users;
  });
```

Benefits:
- ✅ No CORS issues in development
- ✅ Clean relative URLs (`/api/users`)
- ✅ Environment-independent code

## 📊 Nx Graph

View the project dependency graph:

```bash
npx nx graph
```

This will open an interactive visualization of your workspace structure.

## 🚀 Production Build

```bash
# Build both apps for production
npx nx run-many -t build --configuration=production

# Output will be in:
# - dist/frontend/browser (frontend static files)
# - dist/backend (backend Node.js application)
```

## 📝 Notes

- The frontend runs on port **4200** by default
- The backend runs on port **3000** by default
- Make sure both applications are running to test the full functionality
- The "Load Users from Backend" button in the frontend will fetch data from the backend

## 🔧 Troubleshooting

### Port Already in Use

If you get an error that a port is already in use, you can:

1. Stop the process using that port
2. Or change the port in the project configuration:
   - Frontend: `frontend/project.json`
   - Backend: Set `PORT` environment variable

### Tailwind Styles Not Loading

Make sure you have:
1. Run `npm install` to install all dependencies
2. The `styles.css` includes the Tailwind directives
3. The `tailwind.config.js` has the correct content paths

## 📚 Documentation & Guides

### Project Guides
- **[Start Here](./START-HERE.md)** - 2-minute quick setup for new developers
- **[Quick Start Guide](./QUICK-START.md)** - Get up and running quickly
- **[Commands Cheat Sheet](./COMMANDS-CHEATSHEET.md)** - Quick reference for all commands
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions 🔥
- **[Project Structure](./PROJECT-STRUCTURE.md)** - Understanding the codebase organization

### Official Documentation
- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.dev)
- [NestJS Documentation](https://nestjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## 🎯 Next Steps

- Add authentication to the backend (Passport, JWT)
- Create more NestJS modules and services
- Add database integration (TypeORM, Prisma with PostgreSQL/MongoDB)
- Add routing to the frontend
- Implement state management (NgRx, Signals)
- Add validation pipes and DTOs
- Write unit and e2e tests
- Add API documentation (Swagger)
- Deploy to production

## 🏗️ NestJS Features

NestJS provides many built-in features:

- **Dependency Injection** - Clean and testable code
- **Decorators** - `@Controller`, `@Get`, `@Post`, `@Injectable`, etc.
- **Middleware** - Request/response processing
- **Guards** - Authentication and authorization
- **Interceptors** - Transform responses, handle errors
- **Pipes** - Validation and transformation
- **WebSockets** - Real-time communication
- **Microservices** - Scalable architecture

Happy coding! 🎉
