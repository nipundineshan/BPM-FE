import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { User } from '../../../core/models';

@Component({
  selector: 'app-user-approvals',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    ClipboardModule
  ],
  template: `
    <div class="approvals-container p-4">
      <div class="mb-4">
        <h1 class="display-6 fw-bold text-primary">Pending User Approvals</h1>
        <p class="text-muted">Review and verify new user registrations before granting system access.</p>
      </div>

      <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden">
        <mat-table [dataSource]="pendingUsers" class="w-100">
          <!-- Full Name Column -->
          <ng-container matColumnDef="fullName">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Full Name</mat-header-cell>
            <mat-cell *matCellDef="let user">
              <div class="d-flex align-items-center py-2">
                <div class="avatar-sm me-2 bg-primary-subtle text-primary">
                  {{user.fullName.charAt(0)}}
                </div>
                <div>
                  <div class="fw-bold text-dark">{{user.fullName}}</div>
                  <div class="small text-muted">{{user.email}}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Gov ID Column -->
          <ng-container matColumnDef="governmentId">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Government ID</mat-header-cell>
            <mat-cell *matCellDef="let user">
              <code class="bg-light px-2 py-1 rounded small">{{user.governmentId}}</code>
            </mat-cell>
          </ng-container>

          <!-- Wallet Column -->
          <ng-container matColumnDef="walletAddress">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Wallet Address</mat-header-cell>
            <mat-cell *matCellDef="let user">
              <span class="text-truncate d-inline-block" style="max-width: 120px;" [matTooltip]="user.walletAddress">
                {{user.walletAddress}}
              </span>
              <button mat-icon-button class="ms-1 tiny-btn" [cdkCopyToClipboard]="user.walletAddress">
                <mat-icon class="fs-6">content_copy</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="createdAt">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Applied On</mat-header-cell>
            <mat-cell *matCellDef="let user">
              {{user.createdAt | date:'mediumDate'}}
            </mat-cell>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef class="fw-bold text-center">Actions</mat-header-cell>
            <mat-cell *matCellDef="let user" class="justify-content-center">
              <div class="d-flex gap-2">
                <button mat-flat-button color="primary" class="rounded-pill px-3" (click)="approveUser(user)">
                  <mat-icon>check</mat-icon> Approve
                </button>
                <button mat-stroked-button color="warn" class="rounded-pill px-3" (click)="rejectUser(user)">
                  <mat-icon>close</mat-icon> Reject
                </button>
              </div>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

          <!-- Empty State -->
          <div *matNoDataRow class="text-center p-5">
            <mat-icon class="display-1 text-muted mb-3">how_to_reg</mat-icon>
            <h4 class="text-muted">No pending user approvals</h4>
            <p class="text-muted small">All registrations have been processed.</p>
          </div>
        </mat-table>
      </mat-card>
    </div>
  `,
  styles: [`
    .approvals-container {
      background: #f8fafc;
      min-height: calc(100vh - 64px);
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
    .mat-column-actions {
      flex: 0 0 250px;
    }
    .tiny-btn {
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
    mat-row {
      transition: background-color 0.2s;
    }
    mat-row:hover {
      background-color: #f1f5f9;
    }
  `]
})
export class UserApprovalsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['fullName', 'governmentId', 'walletAddress', 'createdAt', 'actions'];
  
  // Mock data for UI development
  pendingUsers: Partial<User>[] = [
    {
      id: '1',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      governmentId: 'GOV-8822-991',
      walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      createdAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL'
    },
    {
      id: '2',
      fullName: 'Robert Smith',
      email: 'robert@company.io',
      governmentId: 'PASS-KM882-90',
      walletAddress: '0x2546BcD3D68103f9975736110A5b331001C3f6d2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'PENDING_APPROVAL'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  approveUser(user: any) {
    this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id);
    this.snackBar.open(`User ${user.fullName} approved successfully!`, 'Close', {
      duration: 3000,
      panelClass: ['bg-success', 'text-white']
    });
  }

  rejectUser(user: any) {
    this.pendingUsers = this.pendingUsers.filter(u => u.id !== user.id);
    this.snackBar.open(`User ${user.fullName} application rejected.`, 'Close', {
      duration: 3000,
      panelClass: ['bg-danger', 'text-white']
    });
  }
}
