import { Component } from '@angular/core';
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
    <div class="auth-container">
      <mat-card class="auth-card shadow-lg">
        <mat-card-header>
          <mat-card-title>Login to BPM</mat-card-title>
          <mat-card-subtitle
            >Blockchain Property Management System</mat-card-subtitle
          >
        </mat-card-header>

        <mat-progress-bar
          *ngIf="isLoading"
          mode="indeterminate"
        ></mat-progress-bar>

        <mat-card-content class="mt-4">
          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="login-form"
          >
            <mat-form-field appearance="outline" class="w-100 mb-3">
              <mat-label>Email Address</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="john@example.com"
              />
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')"
                >Email is required</mat-error
              >
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')"
                >Enter a valid email</mat-error
              >
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100 mb-4">
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
              >
                <mat-icon>{{
                  hidePassword ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')"
                >Password is required</mat-error
              >
            </mat-form-field>

            <div class="d-grid gap-2">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="py-2"
              >
                Login to Dashboard
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-footer class="text-center p-4">
          <span
            >Don't have an account?
            <a
              routerLink="/auth/register"
              class="text-primary text-decoration-none fw-bold"
              >Register Now</a
            ></span
          >
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        padding: 20px;
      }
      .auth-card {
        width: 100%;
        max-width: 450px;
        border-radius: 12px;
        overflow: hidden;
      }
      .login-form {
        display: flex;
        flex-direction: column;
      }
      mat-card-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a237e;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
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
          if (res.data.user.role === 'SUPER_ADMIN') {
            this.router.navigate(['/super-admin/dashboard']);
          } else if (res.data.user.role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else if (res.data.user.role === 'USER') {
            this.router.navigate(['/user/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          alert('Login failed: ' + (err.error?.message || 'Unknown error'));
          this.isLoading = false;
        },
      });
    }
  }
}
