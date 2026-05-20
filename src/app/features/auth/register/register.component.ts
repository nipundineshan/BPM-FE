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
    <div class="auth-wrapper">
      <div class="auth-inner animate-fade-in">
        <!-- Header -->
        <div class="text-center mb-5 animate-slide-in">
           <div class="logo-box mx-auto mb-4 animate-float">
              <mat-icon class="text-white">layers</mat-icon>
           </div>
           <h1 class="h1 fw-black tracking-tighter text-gradient mb-1">BPM CORE</h1>
           <p class="text-secondary fw-bold small opacity-75 letter-spacing-1 uppercase">Initialize Protocol Membership</p>
        </div>

        <mat-card class="glass-panel-heavy overflow-hidden animate-slide-in-up">
          <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="top-progress"></mat-progress-bar>

          <mat-card-content class="p-4 p-md-5">
            <div class="mb-5 text-center">
              <h2 class="h4 fw-black tracking-tight mb-1">Create Identity</h2>
              <p class="text-muted small fw-medium">Join the decentralized property management network.</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="d-flex flex-column gap-2">
              
              <!-- Section: Personal Info -->
              <div class="row g-4 mb-3">
                <div class="col-md-6">
                  <mat-form-field appearance="fill" class="w-100 glass-field">
                    <mat-label>Legal Name</mat-label>
                    <input matInput formControlName="fullName" placeholder="John Doe">
                    <mat-icon matSuffix class="opacity-40">person_outline</mat-icon>
                  </mat-form-field>
                </div>
                <div class="col-md-6">
                  <mat-form-field appearance="fill" class="w-100 glass-field">
                    <mat-label>Neural Mail</mat-label>
                    <input matInput type="email" formControlName="email" placeholder="name@protocol.io">
                    <mat-icon matSuffix class="opacity-40">alternate_email</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <!-- Section: Identity & Contact -->
              <div class="row g-4 mb-3">
                <div class="col-md-6">
                  <mat-form-field appearance="fill" class="w-100 glass-field">
                    <mat-label>Comm-Link Number</mat-label>
                    <input matInput formControlName="phoneNumber" placeholder="+1 (555) 000-0000">
                    <mat-icon matSuffix class="opacity-40">settings_input_antenna</mat-icon>
                  </mat-form-field>
                </div>
                <div class="col-md-6">
                  <mat-form-field appearance="fill" class="w-100 glass-field">
                    <mat-label>Sovereign ID</mat-label>
                    <input matInput formControlName="governmentId" placeholder="Passport or National ID">
                    <mat-icon matSuffix class="opacity-40">verified_user</mat-icon>
                  </mat-form-field>
                </div>
              </div>

              <mat-form-field appearance="fill" class="w-100 glass-field mb-3">
                <mat-label>Public Wallet Node (Web3)</mat-label>
                <input matInput formControlName="walletAddress" placeholder="0x...">
                <mat-icon matSuffix class="opacity-40">account_balance_wallet</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="fill" class="w-100 glass-field mb-3">
                <mat-label>Physical Coordinates (Address)</mat-label>
                <textarea matInput formControlName="address" placeholder="Street, City, Sector" rows="2"></textarea>
                <mat-icon matSuffix class="opacity-40">location_on</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="fill" class="w-100 glass-field mb-4">
                <mat-label>Secure Encryption Key</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" class="opacity-40">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </mat-form-field>

              <div class="glass-info-alert p-3 rounded-4 mb-4 d-flex align-items-center gap-3">
                <div class="alert-icon-box bg-warning-glass">
                  <mat-icon class="fs-5">gavel</mat-icon>
                </div>
                <div class="tiny fw-bold text-muted uppercase tracking-widest lh-sm">
                  Identity validation required. A node administrator will audit your request within 24 standard cycles.
                </div>
              </div>

              <button mat-flat-button color="primary" type="submit" 
                [disabled]="registerForm.invalid || isLoading" 
                class="py-3 fs-6 pulse-primary w-100 mt-2">
                INITIALIZE ENTERPRISE PROFILE
              </button>
            </form>
          </mat-card-content>

          <div class="auth-footer glass-border-top p-4 text-center">
            <span class="text-secondary small fw-medium">Known identity? 
              <a routerLink="/auth/login" class="text-primary-color text-decoration-none fw-black ms-1">AUTHORIZE SESSION</a>
            </span>
          </div>
        </mat-card>

        <div class="mt-5 text-center">
           <p class="tiny text-muted fw-bold letter-spacing-2 uppercase opacity-40">© 2026 BPM CORE • SECURE ONBOARDING PROTOCOL</p>
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
      background: transparent;
      padding: 60px 24px;
    }
    
    .auth-inner {
      width: 100%;
      max-width: 680px;
      position: relative;
      z-index: 10;
    }
    
    .logo-box {
      width: 64px;
      height: 64px;
      background: var(--gradient-1);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
      
      mat-icon { font-size: 32px; width: 32px; height: 32px; }
    }

    .text-gradient {
      background: var(--gradient-1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .glass-panel-heavy {
      border-radius: 3rem !important;
      border: 1px solid var(--glass-border) !important;
    }

    .top-progress {
      height: 3px;
      position: absolute;
      top: 0; left: 0; right: 0;
      background: rgba(255,255,255,0.05);
    }

    .glass-field {
      ::ng-deep {
        .mdc-text-field--filled {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border-radius: 14px !important;
          border: 1px solid var(--glass-border) !important;
          
          &::before, &::after { display: none; }
          
          .mdc-floating-label {
            color: var(--text-muted) !important;
            font-weight: 600;
            letter-spacing: 0.05em;
          }
        }
        
        .mdc-text-field--focused .mdc-floating-label {
          color: var(--primary-color) !important;
        }
        
        .mat-mdc-form-field-focus-overlay { background: transparent !important; }
      }
    }

    .glass-info-alert {
      background: rgba(245, 158, 11, 0.03);
      border: 1px solid rgba(245, 158, 11, 0.1);
    }

    .alert-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .glass-border-top { border-top: 1px solid var(--glass-border); }
    
    .animate-fade-in { animation: fadeIn 1s ease-out; }
    .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
    .animate-slide-in-up { animation: slideInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

    .letter-spacing-1 { letter-spacing: 0.1em; }
    .letter-spacing-2 { letter-spacing: 0.2em; }
    .tracking-widest { letter-spacing: 0.12em; }
    .text-primary-color { color: var(--primary-color); }
    .tiny { font-size: 0.65rem; }
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
        error: (err: any) => {
          alert('Signup failed: ' + (err.error?.message || 'Check your details and try again'));
          this.isLoading = false;
        }
      });
    }
  }
}
