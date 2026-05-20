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
    <div class="auth-wrapper">
      <div class="auth-inner animate-fade-in">
        <!-- Logo Area -->
        <div class="auth-header text-center mb-5">
           <div class="logo-box mx-auto mb-4 animate-float">
              <mat-icon class="text-white">layers</mat-icon>
           </div>
           <h1 class="h1 fw-black tracking-tighter text-gradient mb-1">BPM CORE</h1>
           <p class="text-secondary fw-bold small opacity-75 letter-spacing-1 uppercase">Autonomous Real Estate Protocol</p>
        </div>

        <mat-card class="glass-panel-heavy overflow-hidden animate-slide-in-up">
          <mat-progress-bar
            *ngIf="isLoading"
            mode="indeterminate"
            class="top-progress"
          ></mat-progress-bar>

          <mat-card-content class="p-4 p-md-5">
            <div class="mb-4 text-center">
              <h2 class="h4 fw-black tracking-tight mb-1">Welcome Back</h2>
              <p class="text-muted small fw-medium">Authorize to access your digital assets.</p>
            </div>

            <form
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
              class="d-flex flex-column gap-3"
            >
              <mat-form-field appearance="fill" class="glass-field">
                <mat-label>Email Address</mat-label>
                <input
                  matInput
                  type="email"
                  formControlName="email"
                  placeholder="name@protocol.io"
                />
                <mat-icon matSuffix class="opacity-50">alternate_email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="fill" class="glass-field">
                <mat-label>Access Key</mat-label>
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
                  class="opacity-50"
                >
                  <mat-icon>{{
                    hidePassword ? 'visibility_off' : 'visibility'
                  }}</mat-icon>
                </button>
              </mat-form-field>

              <div class="d-flex justify-content-between align-items-center mb-2 px-1">
                <div class="d-flex align-items-center gap-2">
                  <div class="custom-checkbox">
                    <input type="checkbox" id="remember">
                    <label for="remember"></label>
                  </div>
                  <label class="tiny fw-black text-muted tracking-widest cursor-pointer" for="remember">
                    REMEMBER NODE
                  </label>
                </div>
                <a routerLink="/auth/forgot-password" class="tiny fw-black text-primary-color text-decoration-none tracking-widest">RESET KEY</a>
              </div>

              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="py-3 fs-6 pulse-primary w-100 mt-2"
              >
                {{ isLoading ? 'VERIFYING IDENTITY...' : 'AUTHORIZE SESSION' }}
              </button>
            </form>
          </mat-card-content>

          <div class="auth-footer glass-border-top p-4 text-center">
            <span class="text-secondary small fw-medium"
              >New to the protocol?
              <a
                routerLink="/auth/register"
                class="text-primary-color text-decoration-none fw-black ms-1"
                >INITIALIZE ACCOUNT</a
              ></span
            >
          </div>
        </mat-card>

        <div class="mt-5 text-center">
           <p class="tiny text-muted fw-bold letter-spacing-2 uppercase opacity-40">© 2026 BPM CORE • DISTRIBUTED LEDGER TECHNOLOGY</p>
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
        background: transparent;
        padding: 24px;
        position: relative;
        overflow: hidden;
      }

      .auth-inner {
        width: 100%;
        max-width: 460px;
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
        border-radius: 2.5rem !important;
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
            background-color: rgba(255, 255, 255, 0.03) !important;
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

      .glass-border-top { border-top: 1px solid var(--glass-border); }

      .custom-checkbox {
        position: relative;
        width: 18px;
        height: 18px;
        
        input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0; width: 0;
          
          &:checked ~ label {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            
            &::after { display: block; }
          }
        }
        
        label {
          position: absolute;
          top: 0; left: 0;
          height: 18px; width: 18px;
          background-color: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 4px;
          cursor: pointer;
          
          &::after {
            content: "";
            position: absolute;
            display: none;
            left: 6px; top: 2px;
            width: 5px; height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }
      }

      .animate-fade-in { animation: fadeIn 1s ease-out; }
      .animate-slide-in-up { animation: slideInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }

      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

      .letter-spacing-1 { letter-spacing: 0.1em; }
      .letter-spacing-2 { letter-spacing: 0.2em; }
      .tracking-widest { letter-spacing: 0.12em; }
      .cursor-pointer { cursor: pointer; }
      .text-primary-color { color: var(--primary-color); }
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
        error: (err: any) => {
          alert('Login failed: ' + (err.error?.message || 'Unknown error'));
          this.isLoading = false;
        },
      });
    }
  }
}
