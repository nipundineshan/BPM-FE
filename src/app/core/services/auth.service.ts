import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse, AuthResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: any): Observable<any> {
    console.log(payload);
    
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: any): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response && response.data) {
          const { access_token, user } = response.data;
          localStorage.setItem(this.TOKEN_KEY, access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    );
  }

  redirectByRole(user?: User | null): Promise<boolean> {
    const activeUser = user !== undefined ? user : this.currentUser();
    console.log('AuthService: redirectByRole called with user:', activeUser);
    
    if (!activeUser) {
      console.warn('AuthService: No active user found for redirection');
      return this.router.navigate(['/auth/login']);
    }

    let target = '/dashboard';
    if (activeUser.role === 'SUPER_ADMIN') {
      target = '/super-admin/admins';
    } else if (activeUser.role === 'ADMIN') {
      target = '/dashboard';
    } else if (activeUser.role === 'USER') {
      target = '/dashboard';
    }

    console.log('AuthService: Navigating to:', target);
    const targetSegments = target.split('/').filter(s => !!s);
    return this.router.navigate(['/', ...targetSegments]).then(
      success => {
        console.log('AuthService: Navigation outcome:', success ? 'SUCCESS' : 'FAILURE (Guard rejected or route not found)');
        return success;
      },
      error => {
        console.error('AuthService: Routing Error:', error);
        return false;
      }
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson || userJson === 'undefined') return null;
    
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Error parsing user from storage', e);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }
}
