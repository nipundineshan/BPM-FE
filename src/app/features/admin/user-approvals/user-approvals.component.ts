import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { User } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

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
    ClipboardModule,
  ],
  template: `
    <div class="approvals-container animate-fade-in">
      <div class="mb-5 animate-slide-in">
        <h1 class="h1 fw-black tracking-tighter mb-1 text-gradient">Identity Verification</h1>
        <p class="text-secondary fw-medium opacity-75">
          Review cryptographic identities and registration requests for network access.
        </p>
      </div>

      <mat-card class="glass-table-container animate-slide-in-up">
        <mat-table [dataSource]="dataSource" class="w-100 bg-transparent">
          <!-- Full Name Column -->
          <ng-container matColumnDef="fullName">
            <mat-header-cell *matHeaderCellDef class="fw-black text-primary uppercase tracking-widest tiny"
              >CR-Identity</mat-header-cell
            >
            <mat-cell *matCellDef="let user">
              <div class="d-flex align-items-center py-3">
                <div class="avatar-glass me-3 pulse-primary">
                  {{ user.fullName.charAt(0) }}
                </div>
                <div>
                  <div class="fw-black text-primary-color tracking-tight">{{ user.fullName }}</div>
                  <div class="tiny text-muted fw-bold">{{ user.email }}</div>
                </div>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Gov ID Column -->
          <ng-container matColumnDef="governmentId">
            <mat-header-cell *matHeaderCellDef class="fw-black text-primary uppercase tracking-widest tiny"
              >Gov Protocol ID</mat-header-cell
            >
            <mat-cell *matCellDef="let user">
              <span class="badge-glass bg-primary-glass">
                {{ user.governmentId }}
              </span>
            </mat-cell>
          </ng-container>

          <!-- Wallet Column -->
          <ng-container matColumnDef="walletAddress">
            <mat-header-cell *matHeaderCellDef class="fw-black text-primary uppercase tracking-widest tiny"
              >Blockchain Node</mat-header-cell
            >
            <mat-cell *matCellDef="let user">
              <div class="d-flex align-items-center bg-white-5 px-3 py-1.5 rounded-pill glass-border">
                <span
                  class="text-truncate fw-mono small opacity-75"
                  style="max-width: 140px;"
                  [matTooltip]="user.walletAddress"
                >
                  {{ user.walletAddress }}
                </span>
                <button
                  mat-icon-button
                  class="ms-2 tiny-btn-glass"
                  [cdkCopyToClipboard]="user.walletAddress"
                >
                  <mat-icon class="fs-6 opacity-50">content_copy</mat-icon>
                </button>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Date Column -->
          <ng-container matColumnDef="createdAt">
            <mat-header-cell *matHeaderCellDef class="fw-black text-primary uppercase tracking-widest tiny"
              >Signal Date</mat-header-cell
            >
            <mat-cell *matCellDef="let user" class="tiny fw-bold text-muted">
              {{ user.createdAt | date: 'mediumDate' }}
            </mat-cell>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef class="fw-black text-primary uppercase tracking-widest tiny text-center"
              >Governance</mat-header-cell
            >
            <mat-cell *matCellDef="let user" class="justify-content-center">
              <div class="d-flex gap-2">
                <button
                  mat-button
                  class="badge-glass bg-success-glass px-3 py-1 fw-black h-auto"
                  (click)="approveUser(user)"
                >
                  <mat-icon class="me-1 fs-6">shield_check</mat-icon> VALIDATE
                </button>
                <button
                  mat-button
                  class="badge-glass bg-danger-glass px-3 py-1 fw-black h-auto"
                  (click)="rejectUser(user)"
                >
                  <mat-icon class="me-1 fs-6">security_update_warning</mat-icon> REJECT
                </button>
              </div>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns" class="glass-border-bottom"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns" class="animate-row glass-border-bottom"></mat-row>

          <!-- Empty State -->
          <div *matNoDataRow class="text-center py-5 glass-empty-state-inner">
            <div class="empty-icon-box-glass mx-auto mb-4">
              <mat-icon>verified_user</mat-icon>
            </div>
            <h4 class="fw-black tracking-tight mb-2">Protocol Queue Clear</h4>
            <p class="text-muted small fw-medium">All cryptographic identities have been successfully reconciled.</p>
          </div>
        </mat-table>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .approvals-container {
        padding: 1rem 0;
      }
      
      .text-gradient {
        background: var(--gradient-1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
      .animate-slide-in-up { animation: slideInUp 0.8s ease-out forwards; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

      .glass-table-container {
        border-radius: 2rem !important;
        overflow: hidden;
        border: 1px solid var(--glass-border) !important;
      }

      .avatar-glass {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        background: var(--gradient-1);
        color: white;
        box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
      }

      .mat-column-actions {
        flex: 0 0 280px;
      }
      
      .tiny-btn-glass {
        width: 28px;
        height: 28px;
        line-height: 28px;
        background: rgba(255,255,255,0.05) !important;
        border: 1px solid var(--glass-border) !important;
        border-radius: 8px !important;
      }
      
      mat-row {
        background: transparent !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      mat-row:hover {
        background: rgba(255, 255, 255, 0.03) !important;
        transform: scale(1.005);
      }
      
      .glass-border-bottom {
        border-bottom: 1px solid var(--glass-border) !important;
      }

      .bg-white-5 { background: rgba(255,255,255,0.03); }
      .glass-border { border: 1px solid var(--glass-border); }

      .empty-icon-box-glass {
        width: 80px;
        height: 80px;
        background: rgba(99, 102, 241, 0.05);
        color: var(--primary-color);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.5; }
      }

      .tiny { font-size: 0.65rem; }
      .tracking-widest { letter-spacing: 0.15em; }
    `,
  ],
})
export class UserApprovalsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);

  displayedColumns: string[] = [
    'fullName',
    'governmentId',
    'walletAddress',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>([]);

  constructor() {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers() {
    this.userService.getPendingApprovals().subscribe({
      next: (users) => {
        this.dataSource.data = users || [];
      },
      error: (err: any) => console.error('Error loading pending users', err),
    });
  }

  approveUser(user: User) {
    this.userService
      .approveUser({ id: user.id, status: 'APPROVED' } as any)
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (u) => u.id !== user.id,
          );
          this.snackBar.open(
            `User ${user.fullName} approved successfully!`,
            'Close',
            {
              duration: 3000,
              panelClass: ['bg-success', 'text-white'],
            },
          );
        },
        error: (err: any) => console.error('Error approving user', err),
      });
  }

  rejectUser(user: User) {
    this.userService
      .updateProfile({ id: user.id, status: 'REJECTED' } as any)
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (u) => u.id !== user.id,
          );
          this.snackBar.open(
            `User ${user.fullName} application rejected.`,
            'Close',
            {
              duration: 3000,
              panelClass: ['bg-danger', 'text-white'],
            },
          );
        },
        error: (err: any) => console.error('Error rejecting user', err),
      });
  }
}
