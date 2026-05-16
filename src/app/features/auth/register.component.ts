import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-slate-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Create your account</h2>
          <p class="mt-2 text-center text-sm text-slate-600">
            Already have an account?
            <a routerLink="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">Sign in</a>
          </p>
        </div>

        <!-- Success Alert -->
        <div *ngIf="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg relative animate-in fade-in zoom-in duration-300">
           <div class="flex items-center">
              <svg class="w-12 h-12 text-green-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <strong class="font-bold block text-lg">Registration Successful!</strong>
                <p class="text-sm">Your account is now <strong>pending admin approval</strong>. You will be able to log in once an administrator reviews your request.</p>
                <a routerLink="/auth/login" class="mt-3 inline-block text-sm font-semibold underline hover:text-green-800">Return to Login</a>
              </div>
           </div>
        </div>

        <form *ngIf="!success" class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
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
            <button type="submit" [disabled]="registerForm.invalid || loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span *ngIf="loading" class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Creating account...' : 'Register' }}
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
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Registration failed. Email might already be in use.';
          this.loading = false;
        }
      });
    }
  }
}
