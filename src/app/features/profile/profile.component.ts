import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AppStateService } from '../../core/services/app-state.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 fw-bold">Account Settings</h2>
      
      <div class="row g-4">
        <!-- Left Column: Avatar and Quick Info -->
        <div class="col-lg-4">
          <mat-card class="shadow-sm border-0 text-center p-4 rounded-3">
            <div class="profile-avatar-container mx-auto mb-3">
              <mat-icon class="profile-avatar-icon">account_circle</mat-icon>
              <button mat-mini-fab color="primary" class="edit-avatar-btn">
                <mat-icon>photo_camera</mat-icon>
              </button>
            </div>
            <h4 class="mb-1 fw-bold">{{appState.currentUser()?.fullName}}</h4>
            <p class="text-muted small mb-3">{{appState.currentUser()?.email}}</p>
            <mat-chip-set class="justify-content-center">
              <mat-chip class="bg-primary text-white text-uppercase letter-spacing-1">{{appState.currentUser()?.role}}</mat-chip>
            </mat-chip-set>
            
            <mat-divider class="my-4"></mat-divider>
            
            <div class="text-start">
              <div class="d-flex align-items-center mb-3">
                <mat-icon class="text-muted me-2">verified_user</mat-icon>
                <div class="small">Account Verified</div>
              </div>
              <div class="d-flex align-items-center mb-3">
                <mat-icon class="text-muted me-2">account_balance_wallet</mat-icon>
                <div class="small text-truncate" [title]="appState.currentUser()?.walletAddress || 'No wallet connected'">
                  {{appState.currentUser()?.walletAddress || 'No wallet connected'}}
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Right Column: Edit Profile Form -->
        <div class="col-lg-8">
          <mat-card class="shadow-sm border-0 rounded-3">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="m-0 fs-5 fw-bold">Personal Information</mat-card-title>
            </mat-card-header>
            
            <mat-card-content class="p-4">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 mb-2">
                      <mat-label>Full Name</mat-label>
                      <input matInput formControlName="fullName">
                    </mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 mb-2">
                      <mat-label>Email Address</mat-label>
                      <input matInput formControlName="email" readonly>
                      <mat-icon matSuffix>lock</mat-icon>
                    </mat-form-field>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 mb-2">
                      <mat-label>Phone Number</mat-label>
                      <input matInput formControlName="phoneNumber">
                    </mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100 mb-2">
                      <mat-label>Gov ID / Passport</mat-label>
                      <input matInput formControlName="governmentId">
                    </mat-form-field>
                  </div>
                </div>

                <mat-form-field appearance="outline" class="w-100 mb-2">
                  <mat-label>Wallet Address</mat-label>
                  <input matInput formControlName="walletAddress">
                  <mat-icon matSuffix>account_balance_wallet</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-4">
                  <mat-label>Residential Address</mat-label>
                  <textarea matInput formControlName="address" rows="3"></textarea>
                </mat-form-field>

                <div class="d-flex justify-content-end gap-2">
                  <button mat-stroked-button type="button" (click)="resetForm()">Cancel</button>
                  <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || isLoading">
                    Save Changes
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>

          <!-- Security Section -->
          <mat-card class="shadow-sm border-0 rounded-3 mt-4">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="m-0 fs-5 fw-bold">Security & Password</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold">Password</div>
                  <div class="text-muted small">Change your account password.</div>
                </div>
                <button mat-stroked-button color="primary">Change Password</button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-avatar-container {
      position: relative;
      width: 120px;
      height: 120px;
    }
    .profile-avatar-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: #e0e0e0;
    }
    .edit-avatar-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      transform: scale(0.8);
    }
    .letter-spacing-1 {
      letter-spacing: 1px;
    }
    mat-card {
      border-radius: 12px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public appState: AppStateService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    const user = this.appState.currentUser();
    this.profileForm = this.fb.group({
      fullName: [user?.fullName || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [user?.phoneNumber || ''],
      governmentId: [user?.governmentId || ''],
      walletAddress: [user?.walletAddress || ''],
      address: [user?.address || '']
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // Mock update
      setTimeout(() => {
        this.appState.setUser({ ...this.appState.currentUser()!, ...this.profileForm.value });
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.isLoading = false;
      }, 1000);
    }
  }

  resetForm() {
    const user = this.appState.currentUser();
    this.profileForm.patchValue({
      fullName: user?.fullName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      governmentId: user?.governmentId,
      walletAddress: user?.walletAddress,
      address: user?.address
    });
  }
}
