import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { ActivityLog, User } from '../models';
import { environment } from '../../../environments/environment';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private appState = inject(AppStateService);
  private apiUrl = `${environment.apiUrl}/users`;
  private apiUrl_admin = `${environment.apiUrl}/admin/users`;

  getProfile(): Observable<User> {
    return this.http
      .get<any>(`${this.apiUrl}/profile`)
      .pipe(map((res) => res.data || res));
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.patch<any>(`${this.apiUrl}/profile`, userData).pipe(
      map((res) => res.data || res),
      tap((user) => this.appState.setUser(user)),
    );
  }

  approveUser(userData: Partial<User>): Observable<User> {
    console.log('Approving user with data:', userData);
    return this.http
      .post<any>(`${this.apiUrl_admin}/${userData.id}/approve`, null)
      .pipe(
        map((res) => res.data || res),
        tap((user) => this.appState.setUser(user)),
      );
  }

  updateWallet(walletAddress: string): Observable<User> {
    return this.http
      .patch<any>(`${this.apiUrl}/wallet`, { walletAddress })
      .pipe(
        map((res) => res.data || res),
        tap((user) => this.appState.setUser(user)),
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res.data || res));
  }

  getRecentActivities(): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiUrl}/activities`)
      .pipe(map((res) => res.data || res));
  }

  getPendingApprovals(): Observable<User[]> {
    return this.http
      .get<any>(`${this.apiUrl}/pending-approvals`)
      .pipe(map((res) => res.data || res));
  }

  getAllAdmins(): Observable<User[]> {
    return this.http
      .get<any>(`${this.apiUrl}/admins`)
      .pipe(map((res) => res.data || res));
  }

  createAdmin(adminData: any): Observable<User> {
    return this.http
      .post<any>(`${this.apiUrl}/admins`, adminData)
      .pipe(map((res) => res.data || res));
  }

  getGlobalAuditLogs(): Observable<ActivityLog[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/audit-logs`)
      .pipe(map((res) => res.data || res));
  }
}
