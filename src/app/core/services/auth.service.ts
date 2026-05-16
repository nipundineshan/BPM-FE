import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private appState = inject(AppStateService);

  private apiUrl = `${environment.apiUrl}/auth`;
  currentUser = this.appState.currentUser;

  constructor() {}

  signup(userData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((res) => {
          // For signup, we don't handleAuth because they might be PENDING_APPROVAL
          // The API might not even return a token for signup if approval is required
        }),
      );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout() {
    this.appState.setUser(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  handleAuth(res: AuthResponse) {
    console.log('====================================');
    console.log(res);
    console.log('====================================');
    console.log(res.data);
    console.log('====================================');
    if (res.data.access_token)
      localStorage.setItem('token', res.data.access_token);
    if (res.data.refresh_token)
      localStorage.setItem('refresh_token', res.data.refresh_token);
    this.appState.setUser(res.data.user);

    this.redirectByRole(res.data.user);
  }

  redirectByRole(user: User) {
    if (user.status !== 'APPROVED' && user.role === 'USER') {
      this.router.navigate(['/auth/pending-approval']);
      return;
    }

    switch (user.role) {
      case 'SUPER_ADMIN':
        this.router.navigate(['/super-admin/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'USER':
        this.router.navigate(['/user/dashboard']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }
}
