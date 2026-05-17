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
    <div class="auth-wrapper animate-fade-in">
      <div class="auth-inner">
        <!-- Header -->
        <div class="text-center mb-5">
           <div class="logo-box mx-auto mb-3 shadow-sm">
              <mat-icon class="text-white">business_center</mat-icon>
           </div>
           <h1 class="h3 fw-bold tracking-tight text-slate-900">Create your account</h1>
           <p class="text-slate-500 small">Join the enterprise property management network</p>
        </div>

        <mat-card class="auth-card-premium border-0 shadow-xl overflow-hidden">
          <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="top-progress"></mat-progress-bar>

          <mat-card-content class="p-4 p-md-5">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="d-flex flex-column gap-1">
              
              <!-- Section: Personal Info -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100 custom-field">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="fullName" placeholder="John Doe">
                    <mat-icon matSuffix class="text-slate-400">person_outline</mat-icon>
                  </mat-form-field>
                </div>
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100 custom-field">
                    <mat-label>Email Address</mat-label>
                    <input matInput type="email" formControlName="email" placeholder="name@company.com">
                    <mat-icon matSuffix class="text-slate-400">mail_outline</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <!-- Section: Identity & Contact -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100 custom-field">
                    <mat-label>Phone Number</mat-label>
                    <input matInput formControlName="phoneNumber" placeholder="+1 (555) 000-0000">
                    <mat-icon matSuffix class="text-slate-400">phone_iphone</mat-icon>
                  </mat-form-field>
                </div>
                <div class="col-md-6">
                  <mat-form-field appearance="outline" class="w-100 custom-field">
                    <mat-label>Government ID</mat-label>
                    <input matInput formControlName="governmentId" placeholder="Passport or National ID">
                    <mat-icon matSuffix class="text-slate-400">badge</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <mat-form-field appearance="outline" class="w-100 custom-field mb-3">
                <mat-label>Web3 Wallet Address</mat-label>
                <input matInput formControlName="walletAddress" placeholder="0x...">
                <mat-icon matSuffix class="text-slate-400">account_balance_wallet</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-100 custom-field mb-3">
                <mat-label>Residential Address</mat-label>
                <textarea matInput formControlName="address" placeholder="Street, City, ZIP, Country" rows="2"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-100 custom-field mb-4">
                <mat-label>Security Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" class="text-slate-400">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <div class="info-alert p-3 rounded-3 mb-4 d-flex align-items-start gap-2">
                <mat-icon class="text-amber fs-5">info_outline</mat-icon>
                <div class="tiny fw-medium text-slate-600">
                  Account security notice: Your registration will be verified by a system administrator before full access is granted.
                </div>
              </div>

              <button mat-flat-button color="primary" type="submit" 
                [disabled]="registerForm.invalid || isLoading" 
                class="py-3 fs-6 rounded-3 shadow-sm w-100">
                Create Enterprise Account
              </button>
            </form>
          </mat-card-content>

          <div class="auth-footer bg-slate-50 p-4 text-center border-top">
            <span class="text-slate-500 small">Already have an account? 
              <a routerLink="/auth/login" class="text-primary text-decoration-none fw-bold ms-1">Sign In</a>
            </span>
          </div>
        </mat-card>

        <div class="mt-5 text-center">
           <p class="tiny text-slate-400 fw-medium letter-spacing-1 uppercase">© 2026 BPM ENTERPRISE SYSTEM</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.05) 0px, transparent 50%);
      padding: 40px 24px;
    }
    .auth-inner {
      width: 100%;
      max-width: 640px;
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
    }
    .top-progress {
      height: 4px;
      position: absolute;
      top: 0; left: 0; right: 0;
    }
    .info-alert {
      background-color: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    .text-amber { color: #f59e0b; }
    .bg-slate-50 { background-color: #f8fafc; }
    
    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
