import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../core/models';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  template: `
    <div class="management-container p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="display-6 fw-bold text-primary">Administrator Management</h1>
          <p class="text-muted">Create and manage platform administrators.</p>
        </div>
        <button mat-flat-button color="primary" class="rounded-pill px-4 py-2" (click)="showAddForm = !showAddForm">
          <mat-icon>{{showAddForm ? 'close' : 'person_add'}}</mat-icon>
          {{showAddForm ? 'Cancel' : 'Add New Admin'}}
        </button>
      </div>

      <!-- Add Admin Form -->
      <mat-card class="border-0 shadow-sm mb-4 rounded-4 overflow-hidden animate-fade-in" *ngIf="showAddForm">
        <mat-card-header class="bg-primary text-white p-3">
          <mat-card-title class="fs-5 mb-0">Create New Administrator Account</mat-card-title>
        </mat-card-header>
        <mat-card-content class="p-4">
          <form [formGroup]="adminForm" (ngSubmit)="onAddAdmin()">
            <div class="row g-3">
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="fullName" placeholder="Admin Name">
                  <mat-error *ngIf="adminForm.get('fullName')?.hasError('required')">Name is required</mat-error>
                </mat-form-field>
              </div>
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="admin@bpm.com">
                  <mat-error *ngIf="adminForm.get('email')?.hasError('required')">Email is required</mat-error>
                </mat-form-field>
              </div>
              <div class="col-md-4">
                <mat-form-field appearance="outline" class="w-100">
                  <mat-label>Temporary Password</mat-label>
                  <input matInput type="password" formControlName="password">
                  <mat-error *ngIf="adminForm.get('password')?.hasError('required')">Password is required</mat-error>
                </mat-form-field>
              </div>
              <div class="col-12 text-end">
                <button mat-raised-button color="primary" type="submit" [disabled]="adminForm.invalid">
                  Confirm & Create Admin
                </button>
              </div>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Admin List Table -->
      <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden">
        <mat-table [dataSource]="admins" class="w-100">
          <ng-container matColumnDef="fullName">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Administrator</mat-header-cell>
            <mat-cell *matCellDef="let admin">
              <div class="d-flex align-items-center py-2">
                <div class="avatar-sm me-2 bg-indigo text-white">
                  {{admin.fullName.charAt(0)}}
                </div>
                <div>
                  <div class="fw-bold">{{admin.fullName}}</div>
                  <div class="small text-muted">{{admin.email}}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Status</mat-header-cell>
            <mat-cell *matCellDef="let admin">
              <span class="badge rounded-pill" [ngClass]="admin.isActive ? 'bg-success' : 'bg-danger'">
                {{admin.isActive ? 'Active' : 'Inactive'}}
              </span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="lastLogin">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Last Login</mat-header-cell>
            <mat-cell *matCellDef="let admin">
              {{(admin.updatedAt | date:'medium') || 'Never'}}
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef class="fw-bold text-center">Controls</mat-header-cell>
            <mat-cell *matCellDef="let admin" class="justify-content-center">
              <mat-slide-toggle [checked]="admin.isActive" (change)="toggleAdminStatus(admin)">
                {{admin.isActive ? 'Disable' : 'Enable'}}
              </mat-slide-toggle>
              <button mat-icon-button color="warn" class="ms-3">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
      </mat-card>
    </div>
  `,
  styles: [`
    .management-container {
      background: #f8fafc;
      min-height: calc(100vh - 64px);
    }
    .bg-indigo {
      background-color: #6366f1;
    }
    .avatar-sm {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  showAddForm = false;
  adminForm: FormGroup;
  displayedColumns: string[] = ['fullName', 'status', 'lastLogin', 'actions'];
  
  admins: Partial<User>[] = [
    { id: '1', fullName: 'System Admin 1', email: 'admin1@bpm.com', isActive: true, updatedAt: new Date().toISOString() },
    { id: '2', fullName: 'Regional Head', email: 'head@bpm.com', isActive: true, updatedAt: new Date().toISOString() },
    { id: '3', fullName: 'Verification Officer', email: 'verify@bpm.com', isActive: false, updatedAt: '' }
  ];

  constructor() {
    this.adminForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onAddAdmin() {
    if (this.adminForm.valid) {
      const newAdmin: Partial<User> = {
        id: Math.random().toString(),
        fullName: this.adminForm.value.fullName,
        email: this.adminForm.value.email,
        isActive: true,
        updatedAt: new Date().toISOString()
      };
      this.admins = [...this.admins, newAdmin];
      this.adminForm.reset();
      this.showAddForm = false;
      this.snackBar.open('New Administrator account created successfully!', 'Close', { duration: 3000 });
    }
  }

  toggleAdminStatus(admin: any) {
    admin.isActive = !admin.isActive;
    const msg = admin.isActive ? 'enabled' : 'disabled';
    this.snackBar.open(`Administrator account ${admin.fullName} ${msg}.`, 'Close', { duration: 2000 });
  }
}
