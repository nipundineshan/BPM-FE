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
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-admin',
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
          <mat-card-title>Register Admin</mat-card-title>
          <mat-card-subtitle>Elevated privileges for property management</mat-card-subtitle>
        </mat-card-header>

        <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

        <mat-card-content class="mt-4">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <mat-form-field appearance="outline" class="w-100 mb-2">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" placeholder="Admin Name">
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100 mb-2">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="admin@bpm.com">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100 mb-2">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-100 mb-4">
              <mat-label>Private Key</mat-label>
              <input matInput [type]="hidePrivateKey ? 'password' : 'text'" formControlName="privateKey">
              <button mat-icon-button matSuffix (click)="hidePrivateKey = !hidePrivateKey" type="button">
                <mat-icon>{{hidePrivateKey ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('privateKey')?.hasError('required')">Private key is required</mat-error>
              <mat-hint>This key is used for secure NFT minting</mat-hint>
            </mat-form-field>

            <div class="d-grid gap-2">
              <button mat-raised-button color="warn" type="submit" [disabled]="registerForm.invalid || isLoading" class="py-2">
                Register Admin Account
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-footer class="text-center p-4">
          <span>Already have an account? <a routerLink="/auth/login" class="text-danger text-decoration-none fw-bold">Login</a></span>
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
      background: #fdf2f2;
      padding: 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 500px;
      border-radius: 12px;
      overflow: hidden;
      border-top: 4px solid #f44336;
    }
    .register-form {
      display: flex;
      flex-direction: column;
    }
    mat-card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #b71c1c;
    }
  `]
})
export class RegisterAdminComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hidePrivateKey = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      privateKey: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.registerAdmin(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          alert('Registration failed: ' + (err.error?.message || 'Unknown error'));
          this.isLoading = false;
        }
      });
    }
  }
}
