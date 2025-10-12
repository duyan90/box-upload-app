import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { STORAGE_KEYS } from '../shared/constants';

/**
 * Auth Guard - Protects routes that require Box authentication
 * 
 * Usage:
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if coming from Box OAuth callback (has tokens in URL)
  const urlAccessToken = route.queryParams['access_token'];
  const urlUserId = route.queryParams['user_id'];
  
  if (urlAccessToken && urlUserId) {
    // Coming from OAuth callback - allow through
    // Dashboard component will save tokens to localStorage
    console.log('✅ Auth Guard: OAuth callback detected, allowing access');
    return true;
  }
  
  // Check if user has valid access token in localStorage
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  
  if (accessToken && userId) {
    // User is authenticated
    console.log('✅ Auth Guard: User authenticated via localStorage');
    return true;
  }
  
  // User is not authenticated - redirect to login
  console.log('❌ Auth Guard: No authentication, redirecting to login');
  
  // Store the attempted URL to redirect back after login
  localStorage.setItem('redirect_url', state.url);
  
  // Redirect to login page
  router.navigate(['/login']);
  return false;
};

/**
 * Login Guard - Prevents logged-in users from accessing login page
 * 
 * Usage:
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [loginGuard]
 * }
 */
export const loginGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  
  // Check if coming from Box OAuth callback (has error param)
  const hasError = route.queryParams['error'];
  if (hasError) {
    // Allow showing login page with error message
    console.log('✅ Login Guard: OAuth error, showing login page');
    return true;
  }
  
  // Check if user is already logged in
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  
  if (accessToken && userId) {
    // User is already logged in - redirect to dashboard
    console.log('✅ Login Guard: User already logged in, redirecting to dashboard');
    router.navigate(['/dashboard']);
    return false;
  }
  
  // User is not logged in - allow access to login page
  console.log('✅ Login Guard: User not logged in, showing login page');
  return true;
};

