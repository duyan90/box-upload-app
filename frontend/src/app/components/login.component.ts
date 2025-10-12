import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';

  private readonly boxClientId = environment.box.clientId;
  private readonly boxAuthUrl = environment.box.authUrl;
  private readonly redirectUri = environment.box.redirectUri;

  /**
   * Redirects to Box OAuth login (server-side flow)
   */
  loginWithBox(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Build Box OAuth URL
      const state = this.generateState();
      
      // Store state for verification after callback
      sessionStorage.setItem('oauth_state', state);
      
      const params = new URLSearchParams({
        client_id: this.boxClientId,
        response_type: 'code',
        redirect_uri: this.redirectUri,
        state: state, // CSRF protection
      });

      const authUrl = `${this.boxAuthUrl}?${params.toString()}`;

      // Full page redirect to Box login
      window.location.href = authUrl;
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Box login error:', error);
    }
  }

  /**
   * Generate random state for CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}

