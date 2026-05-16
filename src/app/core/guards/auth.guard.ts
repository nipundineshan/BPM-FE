import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  const user = authService.currentUser();

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
