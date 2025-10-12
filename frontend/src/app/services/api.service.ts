import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * User interface representing user data from the API
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * API response interface for users endpoint
 */
interface UsersResponse {
  users: User[];
}

/**
 * Basic API response interface
 */
interface BasicDataResponse {
  message: string;
}

/**
 * API Service for handling HTTP requests to the backend
 * Uses proxy configuration to route requests through /api
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api'; // Proxy will route this to http://localhost:3000/api

  /**
   * Fetches the list of users from the backend
   * @returns Observable containing users response
   */
  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`);
  }

  /**
   * Fetches basic data from the backend
   * @returns Observable containing basic data response
   */
  getData(): Observable<BasicDataResponse> {
    return this.http.get<BasicDataResponse>(`${this.apiUrl}`);
  }
}

