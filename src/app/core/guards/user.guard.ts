import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (authService.isAuthenticated() && user?.role === 'USER') {
    if (user.status === 'APPROVED') {
      return true;
    } else {
      router.navigate(['/auth/pending-approval']);
      return false;
    }
  } else {
    if (user) {
      authService.redirectByRole(user);
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
  }
};
