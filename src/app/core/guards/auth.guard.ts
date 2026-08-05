import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { STORAGE_KEYS } from '../constants/storage-keys.const';

// TODO: guards a demo login flag, not a real session/token. See login.ts for why
// real Jamendo OAuth isn't wired up yet.
export const authGuard: CanActivateFn = () => {
  if (localStorage.getItem(STORAGE_KEYS.isAuthenticated)) {
    return true;
  }

  // Returning plain `false` would leave the user on the page they came from with
  // no explanation, so send them home and prompt to log in.
  inject(ModalService).openLogin();

  return inject(Router).parseUrl('/');
};
