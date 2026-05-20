import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
  ],
  template: `
    <div class="user-mgmt-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0 fw-bold">User Management</h2>
        <div class="actions">
          <button mat-flat-button color="primary" class="me-2">
            <mat-icon>person_add</mat-icon> Add New User
          </button>
          <button mat-stroked-button color="primary" (click)="exportToCSV()">
            <mat-icon>download</mat-icon> Export CSV
          </button>
        </div>
      </div>

      <mat-form-field appearance="outline" class="w-100 mb-3">
        <mat-label>Search Users</mat-label>
        <input
          matInput
          (keyup)="applyFilter($event)"
          placeholder="Search by name, email or role"
          #input
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="mat-elevation-z2 table-responsive rounded-3 overflow-hidden">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Full Name</th>
            <td mat-cell *matCellDef="let user">
              <div class="d-flex align-items-center py-2">
                <div
                  class="avatar-sm me-2 bg-light rounded-circle d-flex align-items-center justify-content-center"
                >
                  <mat-icon class="text-secondary">person</mat-icon>
                </div>
                {{ user.fullName }}
              </div>
            </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
            <td mat-cell *matCellDef="let user">
              <mat-chip-set>
                <mat-chip [color]="user.role === 'ADMIN' ? 'warn' : 'primary'">
                  {{ user.role | uppercase }}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <!-- Wallet Column -->
          <ng-container matColumnDef="walletAddress">
            <th mat-header-cell *matHeaderCellDef>Wallet Address</th>
            <td mat-cell *matCellDef="let user">
              <span
                class="text-truncate d-inline-block small"
                style="max-width: 150px;"
                [title]="user.walletAddress || 'N/A'"
              >
                {{ user.walletAddress || 'N/A' }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item>
                  <mat-icon>edit</mat-icon>
                  <span>Edit Details</span>
                </button>
                <button mat-menu-item class="text-danger">
                  <mat-icon color="warn">block</mat-icon>
                  <span>Deactivate User</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

          <!-- Row shown when there is no matching data. -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell p-4 text-center" colspan="5">
              No users matching the filter "{{ input.value }}"
            </td>
          </tr>
        </table>

        <mat-paginator
          [pageSizeOptions]="[10, 25, 100]"
          aria-label="Select page of users"
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [
    `
      .user-mgmt-container {
        padding: 10px;
      }
      .avatar-sm {
        width: 32px;
        height: 32px;
      }
      .avatar-sm mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      table {
        width: 100%;
      }
      .mat-column-actions {
        width: 80px;
        text-align: center;
      }
    `,
  ],
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'walletAddress',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users || [];
      },
      error: (err: any) => console.error('Error loading users', err)
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToCSV() {
    alert('Exporting user data to CSV...');
  }
}
