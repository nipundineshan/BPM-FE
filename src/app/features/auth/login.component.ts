import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-slate-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Sign in to your account</h2>
          <p class="mt-2 text-center text-sm text-slate-600">
            Or
            <a routerLink="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">register for a new account</a>
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" formControlName="email" required
                class="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" formControlName="password" required
                class="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password">
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span *ngIf="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div *ngIf="error" class="text-red-500 text-sm text-center mt-2">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          const user = response.data.user;
          console.log('LoginComponent: Login successful, user:', user);
          this.authService.redirectByRole(user).then(navigated => {
            console.log('LoginComponent: Redirection completed. Navigated?', navigated);
            if (!navigated) {
              this.error = 'Login successful, but redirection failed. Please try clicking Dashboard manually.';
              this.loading = false;
            }
          });
        },
        error: (err: any) => {
          this.loading = false;
          // NestJS ExceptionFilter wraps errors: { error: { message: '...' } }
          const errorBody = err.error?.error;
          const message = typeof errorBody === 'object' ? errorBody.message : errorBody || err.error?.message;
          const finalMessage = Array.isArray(message) ? message[0] : message;

          if (finalMessage === 'Your account is pending admin approval.') {
            this.error = 'Your account is awaiting admin approval. Please check back later.';
          } else if (finalMessage === 'Your account has been rejected.') {
            this.error = 'Your application has been rejected. Please contact support.';
          } else if (finalMessage === 'Your account has been blocked.') {
            this.error = 'Your account is currently disabled. Please contact an administrator.';
          } else {
            this.error = finalMessage || 'Invalid credentials. Please try again.';
          }
        }
      });
    }
  }
}
