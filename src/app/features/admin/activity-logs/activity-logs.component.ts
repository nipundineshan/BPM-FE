import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { ActivityLog } from '../../../core/models';

@Component({
  selector: 'app-activity-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 fw-bold">System Audit Logs</h2>

      <mat-card class="border-0 shadow-sm rounded-3 overflow-hidden">
        <mat-table [dataSource]="dataSource" matSort>

          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <mat-header-cell *matHeaderCellDef mat-sort-header> Action </mat-header-cell>
            <mat-cell *matCellDef="let element">
              <div class="d-flex align-items-center">
                <mat-icon class="me-2 text-primary small-icon">history_edu</mat-icon>
                <span class="fw-bold">{{element.action}}</span>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Details Column -->
          <ng-container matColumnDef="details">
            <mat-header-cell *matHeaderCellDef> Details </mat-header-cell>
            <mat-cell *matCellDef="let element"> {{element.details}} </mat-cell>
          </ng-container>

          <!-- User Column -->
          <ng-container matColumnDef="userId">
            <mat-header-cell *matHeaderCellDef mat-sort-header> User </mat-header-cell>
            <mat-cell *matCellDef="let element"> <span class="text-muted small">UID: {{element.userId}}</span> </mat-cell>
          </ng-container>

          <!-- Timestamp Column -->
          <ng-container matColumnDef="timestamp">
            <mat-header-cell *matHeaderCellDef mat-sort-header> Timestamp </mat-header-cell>
            <mat-cell *matCellDef="let element"> {{element.timestamp | date:'medium'}} </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>

        <mat-paginator [pageSizeOptions]="[10, 20, 50]" showFirstLastButtons aria-label="Select page of logs"></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-table { width: 100%; background: transparent; }
    .small-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ActivityLogsComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'action', 'details', 'userId'];
  dataSource: MatTableDataSource<ActivityLog>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Mock Data
    const logs: ActivityLog[] = [
      { id: '1', action: 'LOGIN', details: 'User logged in from IP 192.168.1.1', userId: 'usr_001', timestamp: new Date().toISOString() },
      { id: '2', action: 'PLOT_SUBMISSION', details: 'Registered new plot: "Luxury Villa"', userId: 'usr_001', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', action: 'PLOT_APPROVAL', details: 'Approved plot ID: PLT_992', userId: 'admin_01', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: '4', action: 'NFT_MINTING', details: 'Minted NFT for plot ID: PLT_992', userId: 'admin_01', timestamp: new Date(Date.now() - 8000000).toISOString() },
      { id: '5', action: 'WALLET_UPDATE', details: 'Updated wallet address to 0x456...789', userId: 'usr_002', timestamp: new Date(Date.now() - 86400000).toISOString() },
    ];
    this.dataSource = new MatTableDataSource(logs);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
