import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (authService.isAuthenticated() && user?.role === 'ADMIN') {
    return true;
  } else {
    if (user) {
      authService.redirectByRole(user);
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
  }
};
