import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { superAdminGuard } from './core/guards/super-admin.guard';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'select-role',
    loadComponent: () => import('./features/role-selection/role-selection.component').then(m => m.RoleSelectionComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  
  // Super Admin Routes
  {
    path: 'super-admin',
    canActivate: [authGuard, superAdminGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/super-admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'admins',
        loadComponent: () => import('./features/super-admin/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'plots',
        loadComponent: () => import('./features/admin/approval-management/approval-management.component').then(m => m.ApprovalManagementComponent)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./features/super-admin/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/super-admin/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'user-approvals',
        loadComponent: () => import('./features/admin/user-approvals/user-approvals.component').then(m => m.UserApprovalsComponent)
      },
      {
        path: 'plot-approvals',
        loadComponent: () => import('./features/admin/approval-management/approval-management.component').then(m => m.ApprovalManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'plots',
        loadComponent: () => import('./features/plots/plot-list/plot-list.component').then(m => m.PlotListComponent)
      },
      {
        path: 'nft-minting',
        loadComponent: () => import('./features/admin/approval-management/approval-management.component').then(m => m.ApprovalManagementComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // User Routes
  {
    path: 'user',
    canActivate: [authGuard, userGuard],
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'register-plot',
        loadComponent: () => import('./features/plots/create-plot/create-plot.component').then(m => m.CreatePlotComponent)
      },
      {
        path: 'my-plots',
        loadComponent: () => import('./features/plots/plot-list/plot-list.component').then(m => m.PlotListComponent)
      },
      {
        path: 'plot-details/:id',
        loadComponent: () => import('./features/plots/plot-details/plot-details.component').then(m => m.PlotDetailsComponent)
      },
      {
        path: 'nft-details/:id',
        loadComponent: () => import('./features/plots/nft-details/nft-details.component').then(m => m.NftDetailsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];
