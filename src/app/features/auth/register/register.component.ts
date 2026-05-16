import { Component, inject } from '@angular/core';
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
  selector: 'app-register',
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
        <mat-card-header class="mb-4">
          <mat-card-title class="fs-2 fw-bold text-primary">Join BPM System</mat-card-title>
          <mat-card-subtitle>Create your property management account</mat-card-subtitle>
        </mat-card-header>
        
        <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="row g-3">
              <div class="col-md-6">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="fullName" placeholder="John Doe">
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">Full name is required</mat-error>
                </mat-form-field>
              </div>
              <div class="col-md-6">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="john@example.com">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Enter a valid email</mat-error>
                </mat-form-field>
              </div>
              
              <div class="col-md-6">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phoneNumber" placeholder="+1 234 567 890">
                  <mat-icon matSuffix>phone</mat-icon>
                  <mat-error *ngIf="registerForm.get('phoneNumber')?.hasError('required')">Phone number is required</mat-error>
                </mat-form-field>
              </div>
              <div class="col-md-6">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Government ID</mat-label>
                  <input matInput formControlName="governmentId" placeholder="ID Number / Passport">
                  <mat-icon matSuffix>badge</mat-icon>
                  <mat-error *ngIf="registerForm.get('governmentId')?.hasError('required')">Government ID is required</mat-error>
                </mat-form-field>
              </div>

              <div class="col-12">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Wallet Address</mat-label>
                  <input matInput formControlName="walletAddress" placeholder="0x...">
                  <mat-icon matSuffix>account_balance_wallet</mat-icon>
                  <mat-error *ngIf="registerForm.get('walletAddress')?.hasError('required')">Wallet address is required</mat-error>
                </mat-form-field>
              </div>

              <div class="col-12">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Residential Address</mat-label>
                  <textarea matInput formControlName="address" placeholder="123 Street, City, ZIP, Country" rows="2"></textarea>
                  <mat-icon matSuffix>home</mat-icon>
                  <mat-error *ngIf="registerForm.get('address')?.hasError('required')">Address is required</mat-error>
                </mat-form-field>
              </div>

              <div class="col-12">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Min 6 characters required</mat-error>
                </mat-form-field>
              </div>
            </div>

            <div class="alert alert-warning border-0 mt-3 d-flex align-items-center">
              <mat-icon class="me-2">info</mat-icon>
              <small>Your account will be <strong>pending approval</strong> by an administrator after signup.</small>
            </div>

            <div class="d-grid gap-2 mt-4">
              <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid || isLoading" class="py-3 fs-6 rounded-3 shadow">
                Create Account
              </button>
            </div>
          </form>
        </mat-card-content>

        <mat-card-footer class="text-center p-4">
          <span class="text-muted">Already have an account? 
            <a routerLink="/auth/login" class="text-primary text-decoration-none fw-bold">Sign In</a>
          </span>
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
      background: linear-gradient(135deg, #f5f7fb 0%, #e8f0fe 100%);
      padding: 40px 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 750px;
      border-radius: 24px;
      overflow: hidden;
      border: none;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      governmentId: ['', [Validators.required]],
      walletAddress: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.signup(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/auth/pending-approval']);
        },
        error: (err) => {
          alert('Signup failed: ' + (err.error?.message || 'Check your details and try again'));
          this.isLoading = false;
        }
      });
    }
  }
}
