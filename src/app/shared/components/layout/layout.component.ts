import { Component, ViewChild, inject } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppStateService } from '../../../core/services/app-state.service';
import { AuthService } from '../../../core/services/auth.service';

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
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="app-shell">
      <!-- Navbar -->
      <header class="navbar shadow-sm">
        <div class="navbar-content">
          <div class="d-flex align-items-center">
            <button mat-icon-button (click)="sidenav.toggle()" class="me-2 d-lg-none">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="brand d-flex align-items-center gap-2">
              <div class="logo-square">
                <mat-icon class="text-white">business_center</mat-icon>
              </div>
              <span class="brand-name d-none d-sm-block">BPM <span class="fw-light">Enterprise</span></span>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <!-- Theme Toggle -->
            <button mat-icon-button (click)="appState.toggleTheme()" matTooltip="Toggle theme">
              <mat-icon>{{appState.theme() === 'light' ? 'dark_mode' : 'light_mode'}}</mat-icon>
            </button>
            
            <!-- Notifications -->
            <button mat-icon-button matBadge="2" matBadgeColor="warn" matTooltip="Notifications">
              <mat-icon>notifications</mat-icon>
            </button>

            <div class="v-divider"></div>

            <!-- Profile Menu -->
            <button mat-button [matMenuTriggerFor]="userMenu" class="profile-pill">
              <div class="avatar-circle">
                {{appState.currentUser()?.fullName?.charAt(0)}}
              </div>
              <span class="ms-2 d-none d-md-inline user-name">{{appState.currentUser()?.fullName}}</span>
              <mat-icon class="ms-1 tiny-icon">expand_more</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu" class="profile-dropdown">
              <div class="dropdown-header p-3 border-bottom">
                <div class="fw-bold">{{appState.currentUser()?.fullName}}</div>
                <div class="small text-muted">{{appState.currentUser()?.email}}</div>
              </div>
              <button mat-menu-item [routerLink]="['/', appState.currentUser()?.role?.toLowerCase(), 'profile']">
                <mat-icon>person_outline</mat-icon>
                <span>Account Settings</span>
              </button>
              <button mat-menu-item (click)="appState.toggleTheme()">
                <mat-icon>{{appState.theme() === 'light' ? 'dark_mode' : 'light_mode'}}</mat-icon>
                <span>{{appState.theme() === 'light' ? 'Dark' : 'Light'}} Mode</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()" class="text-danger">
                <mat-icon class="text-danger">logout</mat-icon>
                <span>Sign Out</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </header>

      <mat-sidenav-container class="main-container">
        <!-- Sidebar -->
        <mat-sidenav #sidenav 
          [mode]="(isHandset$ | async) ? 'over' : 'side'" 
          [opened]="!(isHandset$ | async)" 
          class="sidebar border-end">
          
          <div class="sidebar-wrapper">
            <mat-nav-list class="nav-list">
              <!-- Workspace Section -->
              <div class="nav-section">
                <h3 class="nav-label">Workspace</h3>
                
                <!-- Super Admin Menu -->
                <ng-container *ngIf="appState.isSuperAdmin()">
                  <a mat-list-item routerLink="/super-admin/dashboard" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>grid_view</mat-icon>
                    <span matListItemTitle>System Overview</span>
                  </a>
                  <a mat-list-item routerLink="/super-admin/admins" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>manage_accounts</mat-icon>
                    <span matListItemTitle>Manage Admins</span>
                  </a>
                </ng-container>

                <!-- Admin Menu -->
                <ng-container *ngIf="appState.isAdmin()">
                  <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>insights</mat-icon>
                    <span matListItemTitle>Performance</span>
                  </a>
                  <a mat-list-item routerLink="/admin/user-approvals" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>assignment_ind</mat-icon>
                    <span matListItemTitle>User Approvals</span>
                  </a>
                  <a mat-list-item routerLink="/admin/plot-approvals" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>verified_user</mat-icon>
                    <span matListItemTitle>Property Verification</span>
                  </a>
                  <a mat-list-item routerLink="/admin/nft-minting" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>token</mat-icon>
                    <span matListItemTitle>NFT Engine</span>
                  </a>
                </ng-container>

                <!-- User Menu -->
                <ng-container *ngIf="appState.isUser()">
                  <a mat-list-item routerLink="/user/dashboard" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>dashboard_customize</mat-icon>
                    <span matListItemTitle>Dashboard</span>
                  </a>
                  <a mat-list-item routerLink="/user/register-plot" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>add_circle_outline</mat-icon>
                    <span matListItemTitle>Register Property</span>
                  </a>
                  <a mat-list-item routerLink="/user/my-plots" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>maps_home_work</mat-icon>
                    <span matListItemTitle>My Assets</span>
                  </a>
                </ng-container>
              </div>

              <div class="spacer"></div>

              <!-- Management Section -->
              <div class="nav-section mt-auto border-top pt-3">
                 <h3 class="nav-label">System</h3>
                 <a mat-list-item routerLink="/user/profile" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>settings</mat-icon>
                    <span matListItemTitle>Settings</span>
                  </a>
                  <a mat-list-item (click)="logout()" class="logout-item">
                    <mat-icon matListItemIcon color="warn">logout</mat-icon>
                    <span matListItemTitle class="text-danger">Sign Out</span>
                  </a>
              </div>
            </mat-nav-list>

            <!-- Bottom Branding -->
            <div class="sidebar-footer">
              <div class="role-card" [ngClass]="getRoleBadgeClass()">
                <div class="small fw-bold">{{appState.currentUser()?.role?.replace('_', ' ')}}</div>
                <div class="tiny opacity-75">Full Access</div>
              </div>
            </div>
          </div>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="content-area">
          <main class="page-container">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: var(--bg-app);
    }

    .navbar {
      height: var(--navbar-height);
      background-color: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
      padding: 0 1.5rem;
    }

    .navbar-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      cursor: pointer;
    }

    .logo-square {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-name {
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.025em;
      color: var(--text-primary);
    }

    .v-divider {
      width: 1px;
      height: 24px;
      background-color: var(--border-color);
      margin: 0 0.5rem;
    }

    .profile-pill {
      background: rgba(0,0,0,0.03);
      padding: 4px 8px 4px 4px !important;
      border-radius: 9999px !important;
      height: 40px;
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .tiny-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .main-container {
      flex: 1;
    }

    .sidebar {
      width: var(--sidebar-width);
      background-color: var(--bg-sidebar);
      border: none;
    }

    .sidebar-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1.5rem 1rem;
    }

    .nav-section {
      margin-bottom: 2rem;
    }

    .nav-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin: 0 1rem 0.75rem;
    }

    .nav-list a {
      margin-bottom: 0.25rem;
      border-radius: 10px !important;
      color: var(--text-secondary);
      transition: all 0.2s;
    }

    .nav-list a:hover {
      background-color: rgba(99, 102, 241, 0.05);
      color: var(--primary-color);
    }

    .active-item {
      background-color: rgba(99, 102, 241, 0.1) !important;
      color: var(--primary-color) !important;
      font-weight: 600;
    }

    .active-item mat-icon {
      color: var(--primary-color) !important;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 1rem;
    }

    .role-card {
      padding: 1rem;
      border-radius: 12px;
      text-align: center;
    }

    .role-card.bg-danger { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; }
    .role-card.bg-primary { background: rgba(99, 102, 241, 0.1) !important; color: #6366f1 !important; }
    .role-card.bg-success { background: rgba(16, 185, 129, 0.1) !important; color: #10b981 !important; }

    .content-area {
      background-color: var(--bg-app);
    }

    .page-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 2rem;
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
