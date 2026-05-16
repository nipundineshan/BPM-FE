import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  // Super Admin Methods
  getAdmins(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/super-admin/admins`).pipe(
      map(res => res.data)
    );
  }

  createAdmin(payload: any): Observable<User> {
    console.log('admins ',payload);
    
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/super-admin/admins`, payload).pipe(
      map(res => res.data)
    );
  }

  toggleAdminStatus(id: string, isActive: boolean): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/super-admin/admins/${id}/status`, { isActive }).pipe(
      map(res => res.data)
    );
  }

  // Admin Methods
  getPendingUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/admin/users/pending`).pipe(
      map(res => res.data)
    );
  }

  approveUser(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users/${id}/approve`, {});
  }

  rejectUser(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/users/${id}/reject`, {});
  }
}
