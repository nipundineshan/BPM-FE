import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatDividerModule],
  template: `
    <div class="settings-container p-4">
      <div class="mb-4">
        <h1 class="display-6 fw-bold text-primary">System Settings</h1>
        <p class="text-muted">Global configuration for the BPM Enterprise platform.</p>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <mat-card-header class="p-3 bg-light">
              <mat-card-title class="fs-5 mb-0">Platform Access Control</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <div class="fw-bold">Public User Registration</div>
                  <div class="small text-muted">Allow new users to sign up from the landing page.</div>
                </div>
                <mat-slide-toggle checked="true"></mat-slide-toggle>
              </div>
              <mat-divider class="mb-4"></mat-divider>
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <div class="fw-bold">Admin Creation Lockdown</div>
                  <div class="small text-muted">Prevent creation of new admin accounts (emergency only).</div>
                </div>
                <mat-slide-toggle></mat-slide-toggle>
              </div>
              <mat-divider class="mb-4"></mat-divider>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="fw-bold">Maintenance Mode</div>
                  <div class="small text-muted">Disable all user interactions except for Super Admins.</div>
                </div>
                <mat-slide-toggle></mat-slide-toggle>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden">
            <mat-card-header class="p-3 bg-light">
              <mat-card-title class="fs-5 mb-0">Blockchain Configuration</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="mb-3">
                <div class="small text-muted text-uppercase fw-bold mb-1">Active Network</div>
                <div class="d-flex align-items-center">
                  <mat-icon class="text-success me-2">circle</mat-icon>
                  <span class="fw-bold">Ethereum Sepolia Testnet</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="small text-muted text-uppercase fw-bold mb-1">Contract Address</div>
                <code class="bg-light p-2 rounded d-block">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</code>
              </div>
              <button mat-flat-button color="accent" class="rounded-pill">
                <mat-icon>refresh</mat-icon> Update Contract ABI
              </button>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="col-lg-6">
          <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <mat-card-header class="p-3 bg-light">
              <mat-card-title class="fs-5 mb-0">Security Policies</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="mb-4">
                <div class="fw-bold mb-2">Password Policy</div>
                <div class="p-3 bg-light rounded">
                   Minimum 8 characters, must include numbers and special characters.
                </div>
              </div>
              <div class="mb-4">
                <div class="fw-bold mb-2">Session Timeout</div>
                <div class="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                   <span>Auto logout after 30 minutes of inactivity.</span>
                   <button mat-button color="primary">Change</button>
                </div>
              </div>
              <button mat-raised-button color="warn" class="w-100 py-2">
                <mat-icon>security</mat-icon> Rotate System Encryption Keys
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      background: #f8fafc;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class SettingsComponent {}
