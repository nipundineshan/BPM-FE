import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppStateService } from '../../../core/services/app-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <div class="layout-container" [class.dark-theme]="appState.theme() === 'dark'">
      <mat-toolbar color="primary" class="top-navbar shadow-sm">
        <button mat-icon-button (click)="sidenav.toggle()" aria-label="Toggle sidenav">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="logo ms-2">BPM Enterprise</span>
        
        <span class="spacer"></span>
        
        <button mat-icon-button class="me-2" (click)="appState.toggleTheme()">
          <mat-icon>{{appState.theme() === 'light' ? 'dark_mode' : 'light_mode'}}</mat-icon>
        </button>
        
        <button mat-icon-button class="me-2" matBadge="2" matBadgeColor="warn">
          <mat-icon>notifications</mat-icon>
        </button>
        
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-profile">
          <mat-icon>account_circle</mat-icon>
          <span class="ms-2 d-none d-md-inline">{{appState.currentUser()?.fullName}}</span>
          <mat-icon iconPositionEnd>arrow_drop_down</mat-icon>
        </button>
        
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item [routerLink]="['/', appState.currentUser()?.role?.toLowerCase(), 'profile']">
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </button>
          <button mat-menu-item [routerLink]="['/', appState.currentUser()?.role?.toLowerCase(), 'settings']">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav [mode]="(isHandset$ | async) ? 'over' : 'side'" [opened]="!(isHandset$ | async)" class="sidenav">
          <mat-nav-list>
            <div class="nav-header p-4 text-center">
              <div class="avatar-container mb-2">
                <mat-icon class="large-avatar">account_circle</mat-icon>
              </div>
              <div class="fw-bold fs-5">{{appState.currentUser()?.fullName}}</div>
              <div class="badge rounded-pill mt-1" [ngClass]="getRoleBadgeClass()">
                {{appState.currentUser()?.role}}
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <!-- Super Admin Navigation -->
            <ng-container *ngIf="appState.isSuperAdmin()">
              <div mat-subheader class="text-uppercase small fw-bold mt-2">Super Admin Console</div>
              <a mat-list-item routerLink="/super-admin/dashboard" routerLinkActive="active-link">
                <mat-icon matListItemIcon>analytics</mat-icon>
                <span matListItemTitle>System Overview</span>
              </a>
              <a mat-list-item routerLink="/super-admin/admins" routerLinkActive="active-link">
                <mat-icon matListItemIcon>supervisor_account</mat-icon>
                <span matListItemTitle>Manage Admins</span>
              </a>
              <a mat-list-item routerLink="/super-admin/users" routerLinkActive="active-link">
                <mat-icon matListItemIcon>people</mat-icon>
                <span matListItemTitle>System Users</span>
              </a>
              <a mat-list-item routerLink="/super-admin/plots" routerLinkActive="active-link">
                <mat-icon matListItemIcon>location_city</mat-icon>
                <span matListItemTitle>Property Inventory</span>
              </a>
              <a mat-list-item routerLink="/super-admin/audit-logs" routerLinkActive="active-link">
                <mat-icon matListItemIcon>receipt_long</mat-icon>
                <span matListItemTitle>Audit Logs</span>
              </a>
              <a mat-list-item routerLink="/super-admin/settings" routerLinkActive="active-link">
                <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                <span matListItemTitle>System Settings</span>
              </a>
            </ng-container>

            <!-- Admin Navigation -->
            <ng-container *ngIf="appState.isAdmin()">
              <div mat-subheader class="text-uppercase small fw-bold mt-2">Admin Dashboard</div>
              <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active-link">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                <span matListItemTitle>Admin Insights</span>
              </a>
              <a mat-list-item routerLink="/admin/user-approvals" routerLinkActive="active-link">
                <mat-icon matListItemIcon>how_to_reg</mat-icon>
                <span matListItemTitle>User Approvals</span>
              </a>
              <a mat-list-item routerLink="/admin/plot-approvals" routerLinkActive="active-link">
                <mat-icon matListItemIcon>verified</mat-icon>
                <span matListItemTitle>Plot Verifications</span>
              </a>
              <a mat-list-item routerLink="/admin/nft-minting" routerLinkActive="active-link">
                <mat-icon matListItemIcon>token</mat-icon>
                <span matListItemTitle>NFT Minting</span>
              </a>
              <a mat-list-item routerLink="/admin/users" routerLinkActive="active-link">
                <mat-icon matListItemIcon>people</mat-icon>
                <span matListItemTitle>User List</span>
              </a>
            </ng-container>

            <!-- User Navigation -->
            <ng-container *ngIf="appState.isUser()">
              <div mat-subheader class="text-uppercase small fw-bold mt-2">User Workspace</div>
              <a mat-list-item routerLink="/user/dashboard" routerLinkActive="active-link">
                <mat-icon matListItemIcon>dashboard</mat-icon>
                <span matListItemTitle>My Dashboard</span>
              </a>
              <a mat-list-item routerLink="/user/register-plot" routerLinkActive="active-link">
                <mat-icon matListItemIcon>add_location_alt</mat-icon>
                <span matListItemTitle>Register Property</span>
              </a>
              <a mat-list-item routerLink="/user/my-plots" routerLinkActive="active-link">
                <mat-icon matListItemIcon>holiday_village</mat-icon>
                <span matListItemTitle>My Portfolio</span>
              </a>
              <a mat-list-item routerLink="/user/profile" routerLinkActive="active-link">
                <mat-icon matListItemIcon>account_box</mat-icon>
                <span matListItemTitle>My Profile</span>
              </a>
            </ng-container>

            <mat-divider class="mt-2"></mat-divider>
            <div mat-subheader class="text-uppercase small fw-bold">Support</div>
            <a mat-list-item href="#" class="text-muted">
              <mat-icon matListItemIcon>help_outline</mat-icon>
              <span matListItemTitle>Help Center</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <div class="container-fluid py-4">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .top-navbar {
      z-index: 1000;
      position: sticky;
      top: 0;
      background: linear-gradient(90deg, #1a237e 0%, #3f51b5 100%) !important;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .sidenav-container {
      flex: 1;
    }
    .sidenav {
      width: 280px;
      background-color: #ffffff;
      border-right: none;
      box-shadow: 4px 0 10px rgba(0,0,0,0.03);
    }
    .main-content {
      background-color: #f8fafc;
    }
    .logo {
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: -0.5px;
    }
    .active-link {
      background-color: #eef2ff !important;
      color: #3f51b5 !important;
      font-weight: 600;
      border-right: 4px solid #3f51b5;
    }
    .nav-header {
      background: #fcfcfc;
    }
    .large-avatar {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #e2e8f0;
    }
    .badge {
      font-size: 0.7rem;
      padding: 0.35em 0.8em;
    }
    
    /* Dark Theme Support */
    .dark-theme .sidenav {
      background-color: #1a1a1a;
      color: white;
    }
    .dark-theme .main-content {
      background-color: #0f0f0f;
    }
    .dark-theme .active-link {
      background-color: rgba(63, 81, 181, 0.15) !important;
      color: #90caf9 !important;
      border-right: 4px solid #90caf9;
    }
  `]
})
export class LayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  public appState = inject(AppStateService);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  getRoleBadgeClass() {
    const role = this.appState.currentUser()?.role;
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-danger';
      case 'ADMIN': return 'bg-primary';
      case 'USER': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  logout() {
    this.authService.logout();
  }
}
