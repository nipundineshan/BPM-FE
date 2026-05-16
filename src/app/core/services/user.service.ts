import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/profile`).pipe(
      map(res => res.data)
    );
  }

  updateWallet(walletAddress: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/wallet`, { walletAddress }).pipe(
      map(res => res.data)
    );
  }
}
