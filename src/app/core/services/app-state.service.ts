import { Injectable, signal, computed } from '@angular/core';
import { User, Role } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signals
  currentUser = signal<User | null>(this.loadUser());
  isLoading = signal<boolean>(false);
  theme = signal<'light' | 'dark'>(this.loadTheme());

  // Computed
  isAuthenticated = computed(() => !!this.currentUser());
  isSuperAdmin = computed(() => this.currentUser()?.role === 'SUPER_ADMIN');
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isUser = computed(() => this.currentUser()?.role === 'USER');
  isApproved = computed(() => this.currentUser()?.status === 'APPROVED');

  constructor() {}

  setUser(user: User | null) {
    this.currentUser.set(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  }

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeClass(newTheme);
  }

  private loadUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  private loadTheme(): 'light' | 'dark' {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const theme = savedTheme || 'light';
    this.updateThemeClass(theme);
    return theme;
  }

  private updateThemeClass(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
