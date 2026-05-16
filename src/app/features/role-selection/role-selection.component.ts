import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="selection-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold text-primary mb-2">BPM System</h1>
          <p class="lead text-muted">Blockchain Property Management & NFT Registry</p>
        </div>

        <div class="row justify-content-center g-4">
          <!-- Admin Card -->
          <div class="col-md-5 col-lg-4">
            <mat-card class="role-card h-100 border-0 shadow-lg text-center p-4 clickable" (click)="selectRole('admin')">
              <div class="role-icon-wrapper bg-primary text-white mx-auto mb-4">
                <mat-icon>admin_panel_settings</mat-icon>
              </div>
              <mat-card-header class="justify-content-center mb-3">
                <mat-card-title class="fs-3 fw-bold">Administrator</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-muted">Manage property approvals, users, activity logs, and system NFT registry.</p>
                <button mat-flat-button color="primary" class="w-100 mt-3 py-2 fs-6 rounded-pill">
                  Login as Admin
                </button>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- User Card -->
          <div class="col-md-5 col-lg-4">
            <mat-card class="role-card h-100 border-0 shadow-lg text-center p-4 clickable" (click)="selectRole('user')">
              <div class="role-icon-wrapper bg-accent text-white mx-auto mb-4">
                <mat-icon>person</mat-icon>
              </div>
              <mat-card-header class="justify-content-center mb-3">
                <mat-card-title class="fs-3 fw-bold">Property User</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-muted">Browse plots, list new properties, manage your portfolio, and mint NFTs.</p>
                <button mat-flat-button color="accent" class="w-100 mt-3 py-2 fs-6 rounded-pill text-white">
                  Login as User
                </button>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="text-center mt-5">
          <p class="text-muted">New to the system? 
            <a routerLink="/auth/register" class="text-primary fw-bold text-decoration-none">Create an Account</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .selection-container {
      background: linear-gradient(135deg, #f5f7fb 0%, #e8f0fe 100%);
    }
    .role-card {
      border-radius: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .role-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
    }
    .role-icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .role-icon-wrapper mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    .bg-accent {
      background-color: #f50057;
    }
    .clickable {
      user-select: none;
    }
  `]
})
export class RoleSelectionComponent {
  constructor(private router: Router) {}

  selectRole(role: 'admin' | 'user') {
    // Optionally store the selected role in session storage to pre-fill login
    sessionStorage.setItem('selected_role', role);
    this.router.navigate(['/auth/login']);
  }
}
