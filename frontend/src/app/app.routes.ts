import { Route } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard] // Prevent logged-in users from accessing login page
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Protect dashboard - requires authentication
  },
  {
    path: '**',
    redirectTo: '/login' // Catch-all route
  }
];
