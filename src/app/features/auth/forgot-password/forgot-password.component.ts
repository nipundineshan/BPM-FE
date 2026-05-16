import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-forgot-password',
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
    MatProgressBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card shadow-lg">
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
          <mat-card-subtitle>Enter your email to receive reset instructions</mat-card-subtitle>
        </mat-card-header>

        <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

        <mat-card-content class="mt-4">
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="forgot-form">
            <mat-form-field appearance="outline" class="w-100 mb-4">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="john@example.com">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="forgotForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="forgotForm.get('email')?.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <div class="d-grid gap-2">
              <button mat-raised-button color="primary" type="submit" [disabled]="forgotForm.invalid || isLoading" class="py-2">
                Send Reset Link
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-footer class="text-center p-4">
          <span>Remember your password? <a routerLink="/auth/login" class="text-primary text-decoration-none fw-bold">Back to Login</a></span>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
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
    .forgot-form {
      display: flex;
      flex-direction: column;
    }
    mat-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a237e;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      // Mock API call
      setTimeout(() => {
        alert('If this email is registered, you will receive reset instructions.');
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      }, 1500);
    }
  }
}
