import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ActivityLog } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatIconModule, 
    MatChipsModule
  ],
  template: `
    <div class="logs-container p-4">
      <div class="mb-4">
        <h2 class="fw-bold">Activity & Audit Logs</h2>
        <p class="text-muted">Track all significant actions performed within the system.</p>
      </div>

      <div class="mat-elevation-z2 rounded-3 overflow-hidden">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- Timestamp Column -->
          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Time</th>
            <td mat-cell *matCellDef="let log" class="small text-muted">
              {{log.timestamp | date:'medium'}}
            </td>
          </ng-container>

          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
            <td mat-cell *matCellDef="let log">
              <span class="badge" [ngClass]="getActionClass(log.action)">
                {{log.action}}
              </span>
            </td>
          </ng-container>

          <!-- Details Column -->
          <ng-container matColumnDef="details">
            <th mat-header-cell *matHeaderCellDef>Details</th>
            <td mat-cell *matCellDef="let log" class="small">
              {{log.details}}
            </td>
          </ng-container>

          <!-- User Column -->
          <ng-container matColumnDef="userId">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>User ID</th>
            <td mat-cell *matCellDef="let log" class="small fw-bold">
              {{log.userId}}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 20, 50]" showFirstLastButtons aria-label="Select page of logs"></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .logs-container { background: #f8fafc; min-height: calc(100vh - 64px); }
    .badge { font-size: 0.7rem; padding: 0.5em 1em; border-radius: 6px; font-weight: 600; }
    .bg-login { background: #e0e7ff; color: #4338ca; }
    .bg-plot { background: #fef3c7; color: #92400e; }
    .bg-nft { background: #d1fae5; color: #065f46; }
    .bg-default { background: #f3f4f6; color: #374151; }
  `]
})
export class ActivityLogsComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'action', 'details', 'userId'];
  dataSource = new MatTableDataSource<ActivityLog>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.userService.getRecentActivities().subscribe({
      next: (logs) => {
        this.dataSource.data = logs || [];
      },
      error: (err: any) => console.error('Error fetching activity logs', err)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getActionClass(action: string): string {
    const act = action.toUpperCase();
    if (act.includes('LOGIN')) return 'bg-login';
    if (act.includes('PLOT')) return 'bg-plot';
    if (act.includes('NFT') || act.includes('MINT')) return 'bg-nft';
    return 'bg-default';
  }
}
