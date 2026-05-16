import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Super Admin Methods
  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/super-admin/admins`);
  }

  createAdmin(payload: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/super-admin/admins`, payload);
  }

  toggleAdminStatus(id: string, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/super-admin/admins/${id}/status`, { isActive });
  }

  // Admin Methods
  getPendingUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users/pending`);
  }

  approveUser(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users/${id}/approve`, {});
  }

  rejectUser(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users/${id}/reject`, {});
  }
}
