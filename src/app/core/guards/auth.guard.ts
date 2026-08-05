import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

// TODO: guards a demo login flag, not a real session/token. See login.ts for why
// real Jamendo OAuth isn't wired up yet.
export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).isAuthenticated()) {
    return true;
  }

  const router = inject(Router);
  inject(ModalService).openLogin();

  // Cancelling keeps the user where they are, but on a cold start there is no
  // page to stay on, so that one case still needs somewhere to land.
  return router.navigated ? false : router.parseUrl('/');
};
