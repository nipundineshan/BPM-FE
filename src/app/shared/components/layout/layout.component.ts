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
    <div class="app-shell" [class.dark-theme]="appState.theme() === 'dark'">
      <!-- Navbar -->
      <header class="navbar glass-panel-heavy">
        <div class="navbar-content">
          <div class="d-flex align-items-center">
            <button mat-icon-button (click)="sidenav.toggle()" class="me-2 d-lg-none glass-btn">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="brand d-flex align-items-center gap-3" routerLink="/">
              <div class="logo-square animate-float">
                <mat-icon class="text-white">layers</mat-icon>
              </div>
              <div class="brand-text">
                <span class="brand-name">BPM <span class="fw-light opacity-75">CORE</span></span>
                <span class="brand-tagline">Web3 Real Estate</span>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center gap-3">
            <!-- Theme Toggle -->
            <button mat-icon-button (click)="appState.toggleTheme()" matTooltip="Toggle theme" class="glass-btn pulse-on-hover">
              <mat-icon class="text-gradient">{{appState.theme() === 'light' ? 'dark_mode' : 'light_mode'}}</mat-icon>
            </button>
            
            <!-- Notifications -->
            <button mat-icon-button matBadge="3" matBadgeColor="warn" matTooltip="Notifications" class="glass-btn">
              <mat-icon>notifications_none</mat-icon>
            </button>

            <div class="v-divider"></div>

            <!-- Profile Menu -->
            <button mat-button [matMenuTriggerFor]="userMenu" class="profile-pill glass-panel">
              <div class="avatar-circle pulse-primary">
                {{appState.currentUser()?.fullName?.charAt(0)}}
              </div>
              <span class="ms-2 d-none d-md-inline user-name fw-bold">{{appState.currentUser()?.fullName}}</span>
              <mat-icon class="ms-1 tiny-icon">expand_more</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu" class="profile-dropdown glass-panel-heavy">
              <div class="dropdown-header p-4">
                <div class="fw-black text-gradient fs-5">{{appState.currentUser()?.fullName}}</div>
                <div class="small text-muted mb-2">{{appState.currentUser()?.email}}</div>
                <div class="badge-glass" [ngClass]="getRoleBadgeClass() + '-glass'">
                  {{appState.currentUser()?.role}}
                </div>
              </div>
              <mat-divider class="opacity-10"></mat-divider>
              <div class="p-2">
                <button mat-menu-item [routerLink]="['/', appState.currentUser()?.role?.toLowerCase(), 'profile']">
                  <mat-icon>account_circle</mat-icon>
                  <span>Profile Settings</span>
                </button>
                <button mat-menu-item (click)="appState.toggleTheme()">
                  <mat-icon>{{appState.theme() === 'light' ? 'dark_mode' : 'light_mode'}}</mat-icon>
                  <span>{{appState.theme() === 'light' ? 'Dark' : 'Light'}} View</span>
                </button>
                <mat-divider class="my-2 opacity-10"></mat-divider>
                <button mat-menu-item (click)="logout()" class="text-danger">
                  <mat-icon class="text-danger">power_settings_new</mat-icon>
                  <span class="fw-bold">Sign Out</span>
                </button>
              </div>
            </mat-menu>
          </div>
        </div>
      </header>

      <mat-sidenav-container class="main-container" [hasBackdrop]="(isHandset$ | async)">
        <!-- Sidebar -->
        <mat-sidenav #sidenav 
          [mode]="(isHandset$ | async) ? 'over' : 'side'" 
          [opened]="!(isHandset$ | async)" 
          class="sidebar glass-panel">
          
          <div class="sidebar-wrapper">
            <mat-nav-list class="nav-list">
              <!-- Workspace Section -->
              <div class="nav-section">
                <h3 class="nav-label">Main Console</h3>
                
                <!-- Super Admin Menu -->
                <ng-container *ngIf="appState.isSuperAdmin()">
                  <a mat-list-item routerLink="/super-admin/dashboard" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>dashboard</mat-icon>
                    <span matListItemTitle>System Hub</span>
                  </a>
                  <a mat-list-item routerLink="/super-admin/admins" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                    <span matListItemTitle>Node Operators</span>
                  </a>
                </ng-container>

                <!-- Admin Menu -->
                <ng-container *ngIf="appState.isAdmin()">
                  <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>analytics</mat-icon>
                    <span matListItemTitle>Analytics</span>
                  </a>
                  <a mat-list-item routerLink="/admin/user-approvals" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>how_to_reg</mat-icon>
                    <span matListItemTitle>Onboarding</span>
                  </a>
                  <a mat-list-item routerLink="/admin/plot-approvals" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>gavel</mat-icon>
                    <span matListItemTitle>Verifications</span>
                  </a>
                  <a mat-list-item routerLink="/admin/nft-minting" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>token</mat-icon>
                    <span matListItemTitle>Minting Engine</span>
                  </a>
                </ng-container>

                <!-- User Menu -->
                <ng-container *ngIf="appState.isUser()">
                  <a mat-list-item routerLink="/user/dashboard" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>grid_view</mat-icon>
                    <span matListItemTitle>Overview</span>
                  </a>
                  <a mat-list-item routerLink="/user/register-plot" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>add_business</mat-icon>
                    <span matListItemTitle>Tokenize Asset</span>
                  </a>
                  <a mat-list-item routerLink="/user/my-plots" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>account_balance</mat-icon>
                    <span matListItemTitle>My Portfolio</span>
                  </a>
                </ng-container>
              </div>

              <div class="spacer"></div>

              <!-- Management Section -->
              <div class="nav-section mt-auto">
                 <h3 class="nav-label">Preferences</h3>
                 <a mat-list-item routerLink="/user/profile" routerLinkActive="active-item">
                    <mat-icon matListItemIcon>tune</mat-icon>
                    <span matListItemTitle>Settings</span>
                  </a>
                  <a mat-list-item (click)="logout()" class="logout-item">
                    <mat-icon matListItemIcon class="text-danger">logout</mat-icon>
                    <span matListItemTitle class="text-danger fw-bold">Terminate</span>
                  </a>
              </div>
            </mat-nav-list>

            <!-- Bottom Branding -->
            <div class="sidebar-footer">
              <div class="role-card-glass" [ngClass]="getRoleBadgeClass()">
                <div class="status-dot animate-pulse"></div>
                <div class="role-info">
                  <div class="role-name">{{appState.currentUser()?.role?.replace('_', ' ')}}</div>
                  <div class="role-status">Active Session</div>
                </div>
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
      background: transparent;
    }

    .navbar {
      height: var(--navbar-height);
      z-index: 1000;
      padding: 0 2rem;
      margin: 1rem;
      border-radius: 1.25rem !important;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: calc(100% - 2rem);
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
      width: 40px;
      height: 40px;
      background: var(--gradient-1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand-name {
      font-weight: 800;
      font-size: 1.35rem;
      letter-spacing: -0.04em;
      color: var(--text-primary);
    }

    .brand-tagline {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--primary-color);
    }

    .v-divider {
      width: 1px;
      height: 32px;
      background: var(--glass-border);
      margin: 0 0.5rem;
    }

    .glass-btn {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid var(--glass-border) !important;
      border-radius: 12px !important;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: translateY(-2px);
      }
    }

    .profile-pill {
      background: rgba(255,255,255,0.05) !important;
      padding: 6px 12px 6px 6px !important;
      border-radius: 16px !important;
      height: 48px;
      border: 1px solid var(--glass-border) !important;
      
      &:hover {
        background: rgba(255,255,255,0.1) !important;
      }
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      background: var(--gradient-1);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
    }

    .user-name {
      font-size: 0.9rem;
      color: var(--text-primary);
    }

    .main-container {
      flex: 1;
      margin-top: calc(var(--navbar-height) + 2rem);
      background: transparent !important;
    }

    .sidebar {
      width: var(--sidebar-width);
      margin: 0 1rem 1rem 1rem;
      height: calc(100vh - var(--navbar-height) - 4rem) !important;
      border-radius: 1.5rem !important;
      border: 1px solid var(--glass-border) !important;
      top: calc(var(--navbar-height) + 2rem) !important;
    }

    .sidebar-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 2rem 1.25rem;
    }

    .nav-section {
      margin-bottom: 2.5rem;
    }

    .nav-label {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-muted);
      margin: 0 1rem 1rem;
    }

    .nav-list a {
      margin-bottom: 0.5rem;
      border-radius: 14px !important;
      color: var(--text-secondary);
      transition: all 0.3s;
      padding: 0.75rem 1rem !important;
      
      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        margin-right: 12px !important;
      }
    }

    .nav-list a:hover {
      background: rgba(99, 102, 241, 0.08) !important;
      color: var(--primary-color) !important;
      transform: translateX(5px);
    }

    .active-item {
      background: var(--gradient-1) !important;
      color: white !important;
      box-shadow: 0 8px 20px -6px rgba(99, 102, 241, 0.5) !important;
      font-weight: 700;
      
      mat-icon {
        color: white !important;
      }
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 1.5rem;
    }

    .role-card-glass {
      padding: 1.25rem;
      border-radius: 1.25rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 12px #10b981;
    }

    .role-name {
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .role-status {
      font-size: 0.65rem;
      opacity: 0.6;
      font-weight: 600;
    }

    .role-card-glass.bg-danger { color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    .role-card-glass.bg-primary { color: #6366f1; border-color: rgba(99, 102, 241, 0.2); }
    .role-card-glass.bg-success { color: #10b981; border-color: rgba(16, 185, 129, 0.2); }

    .content-area {
      background: transparent !important;
    }

    .page-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 1rem 2rem 2rem;
    }

    /* Scrollbar for Sidebar */
    .sidebar ::-webkit-scrollbar { width: 4px; }
    .sidebar ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

    @media (max-width: 991.98px) {
      .navbar { margin: 0.5rem; width: calc(100% - 1rem); }
      .sidebar { margin: 0; border-radius: 0 !important; height: 100vh !important; top: 0 !important; }
      .main-container { margin-top: calc(var(--navbar-height) + 1rem); }
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
