import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ActivityLog } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatChipsModule],
  template: `
    <div class="logs-container p-4">
      <div class="mb-4">
        <h1 class="display-6 fw-bold text-primary">System Audit Logs</h1>
        <p class="text-muted">Traceable record of all administrative and system-critical actions.</p>
      </div>

      <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden">
        <mat-table [dataSource]="logs" class="w-100">
          <ng-container matColumnDef="timestamp">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Timestamp</mat-header-cell>
            <mat-cell *matCellDef="let log" class="text-muted">
              {{log.timestamp | date:'medium'}}
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="action">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Action</mat-header-cell>
            <mat-cell *matCellDef="let log">
              <span class="badge" [ngClass]="getActionClass(log.action)">
                {{log.action}}
              </span>
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="details">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Details</mat-header-cell>
            <mat-cell *matCellDef="let log">
              {{log.details}}
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="userId">
            <mat-header-cell *matHeaderCellDef class="fw-bold">Performed By</mat-header-cell>
            <mat-cell *matCellDef="let log">
              <div class="d-flex align-items-center">
                <mat-icon class="me-1 fs-5 text-muted">person</mat-icon>
                {{log.userId}}
              </div>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
      </mat-card>
    </div>
  `,
  styles: [`
    .logs-container {
      background: #f8fafc;
      min-height: calc(100vh - 64px);
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.4em 0.8em;
    }
  `]
})
export class AuditLogsComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'action', 'details', 'userId'];
  logs: ActivityLog[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.userService.getGlobalAuditLogs().subscribe({
      next: (logs) => this.logs = logs,
      error: (err: any) => console.error('Error loading global audit logs', err)
    });
  }

  getActionClass(action: string) {
    if (action.includes('CREATED')) return 'bg-success';
    if (action.includes('APPROVED')) return 'bg-primary';
    if (action.includes('MINTED')) return 'bg-info';
    if (action.includes('SYSTEM')) return 'bg-dark';
    return 'bg-secondary';
  }
}
