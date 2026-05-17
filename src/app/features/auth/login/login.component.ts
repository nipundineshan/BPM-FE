import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="auth-wrapper animate-fade-in">
      <div class="auth-inner">
        <!-- Logo Area -->
        <div class="auth-header text-center mb-5">
           <div class="logo-box mx-auto mb-3 shadow-sm">
              <mat-icon class="text-white">business_center</mat-icon>
           </div>
           <h1 class="h3 fw-bold tracking-tight text-slate-900">Sign in to BPM</h1>
           <p class="text-slate-500 small">Enterprise Property Management on Blockchain</p>
        </div>

        <mat-card class="auth-card-premium border-0 shadow-xl overflow-hidden">
          <mat-progress-bar
            *ngIf="isLoading"
            mode="indeterminate"
            class="top-progress"
          ></mat-progress-bar>

          <mat-card-content class="p-4 p-md-5">
            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="d-flex flex-column gap-2"
            >
              <mat-form-field appearance="outline" class="custom-field">
                <mat-label>Email Address</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="name@company.com"
                />
                <mat-icon matSuffix class="text-slate-400">mail_outline</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="custom-field">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                />
                <button
                  mat-icon-button
                  matSuffix
                  (click)="hidePassword = !hidePassword"
                  type="button"
                  class="text-slate-400"
                >
                  <mat-icon>{{
                    hidePassword ? 'visibility_off' : 'visibility'
                  }}</mat-icon>
                </button>
              </mat-form-field>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember">
                  <label class="form-check-label tiny fw-bold text-slate-500" for="remember">
                    REMEMBER ME
                  </label>
                </div>
                <a routerLink="/auth/forgot-password" class="tiny fw-bold text-primary text-decoration-none">FORGOT PASSWORD?</a>
              </div>

              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="py-3 fs-6 rounded-3 shadow-sm w-100"
              >
                {{ isLoading ? 'Authenticating...' : 'Sign In' }}
              </button>
            </form>
          </mat-card-content>

          <div class="auth-footer bg-slate-50 p-4 text-center border-top">
            <span class="text-slate-500 small"
              >New to the platform?
              <a
                routerLink="/auth/register"
                class="text-primary text-decoration-none fw-bold ms-1"
                >Create an account</a
              ></span
            >
          </div>
        </mat-card>

        <div class="mt-5 text-center">
           <p class="tiny text-slate-400 fw-medium letter-spacing-1 uppercase">© 2026 BPM ENTERPRISE SYSTEM</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-app);
        background-image: 
          radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.05) 0px, transparent 50%);
        padding: 24px;
      }
      .auth-inner {
        width: 100%;
        max-width: 440px;
      }
      .logo-box {
        width: 48px;
        height: 48px;
        background: var(--primary-color);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .auth-card-premium {
        border-radius: 1.5rem !important;
        background-color: var(--bg-card);
      }
      .top-progress {
        height: 4px;
        position: absolute;
        top: 0; left: 0; right: 0;
      }
      .custom-field {
        margin-bottom: 0.5rem;
      }
      .bg-slate-50 { background-color: var(--bg-app); }
      
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.redirectByRole(res.data.user);
        },
        error: (err) => {
          alert('Login failed: ' + (err.error?.message || 'Unknown error'));
          this.isLoading = false;
        },
      });
    }
  }
}
