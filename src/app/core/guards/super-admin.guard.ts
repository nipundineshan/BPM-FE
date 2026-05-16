import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (authService.isAuthenticated() && user?.role === 'SUPER_ADMIN') {
    return true;
  } else {
    // If not super admin but authenticated, redirect to their respective dashboard
    if (user) {
      authService.redirectByRole(user);
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
  }
};
