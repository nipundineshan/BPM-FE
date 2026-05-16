import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models';
import { environment } from '../../../environments/environment';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private appState = inject(AppStateService);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile`, userData).pipe(
      tap(user => this.appState.setUser(user))
    );
  }

  updateWallet(walletAddress: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/wallet`, { walletAddress }).pipe(
      tap(user => this.appState.setUser(user))
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
