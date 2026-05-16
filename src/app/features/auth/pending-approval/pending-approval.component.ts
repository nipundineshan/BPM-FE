import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="pending-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <mat-card class="pending-card shadow-lg text-center p-5">
        <div class="icon-circle bg-warning text-white mx-auto mb-4">
          <mat-icon>hourglass_empty</mat-icon>
        </div>
        <mat-card-header class="justify-content-center mb-3">
          <mat-card-title class="display-6 fw-bold text-dark">Registration Pending</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="lead text-muted mb-4">
            Thank you for registering with BPM System. Your account is currently <strong>pending approval</strong> by our administration team.
          </p>
          <div class="alert alert-info border-0 shadow-sm text-start mb-4">
            <h6 class="fw-bold mb-2">What happens next?</h6>
            <ul class="mb-0 ps-3">
              <li>An admin will review your submitted government ID and details.</li>
              <li>You will receive an email once your account has been activated.</li>
              <li>After approval, you can access your dashboard and register plots.</li>
            </ul>
          </div>
          <div class="d-flex flex-column gap-3">
            <button mat-flat-button color="primary" (click)="logout()" class="py-2 fs-6 rounded-pill">
              <mat-icon class="me-2">logout</mat-icon> Logout & Return Home
            </button>
            <button mat-stroked-button color="accent" class="py-2 fs-6 rounded-pill">
              <mat-icon class="me-2">support_agent</mat-icon> Contact Support
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .pending-container {
      background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
    }
    .pending-card {
      max-width: 550px;
      border-radius: 24px;
      border: none;
    }
    .icon-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2);
    }
    .icon-circle mat-icon {
      font-size: 50px;
      width: 50px;
      height: 50px;
    }
  `]
})
export class PendingApprovalComponent {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
