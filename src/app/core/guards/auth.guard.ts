import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.isAuthenticated();
  const user = authService.currentUser();

  console.log('AuthGuard: Checking access for', state.url);
  console.log('AuthGuard: isAuthenticated =', isAuth);
  console.log('AuthGuard: user =', user);

  if (!isAuth) {
    console.warn('AuthGuard: Not authenticated, redirecting to login');
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    console.warn('AuthGuard: Insufficient roles. Required:', requiredRoles, 'User role:', user.role);
    router.navigate(['/dashboard']);
    return false;
  }

  console.log('AuthGuard: Access granted');
  return true;
};
