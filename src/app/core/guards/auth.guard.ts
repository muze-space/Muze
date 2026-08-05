import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

// TODO: guards a demo login flag, not a real session/token. See login.ts for why
export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).isAuthenticated()) {
    return true;
  }

  const router = inject(Router);
  inject(ModalService).openLogin();

  return router.navigated ? false : router.parseUrl('/');
};
