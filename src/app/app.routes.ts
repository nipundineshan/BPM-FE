import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'super-admin/admins',
        loadComponent: () => import('./features/super-admin/admin-management.component').then(m => m.AdminManagementComponent),
        data: { roles: ['SUPER_ADMIN'] }
      },
      {
        path: 'admin/approvals',
        loadComponent: () => import('./features/admin/user-approval.component').then(m => m.UserApprovalComponent),
        data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
      },
      {
        path: 'plots/create',
        loadComponent: () => import('./features/plots/plot-create.component').then(m => m.PlotCreateComponent),
        data: { roles: ['ADMIN', 'USER'] }
      },
      {
        path: 'plots/:id',
        loadComponent: () => import('./features/plots/plot-detail.component').then(m => m.PlotDetailComponent)
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
    redirectTo: 'auth/login'
  }
];
