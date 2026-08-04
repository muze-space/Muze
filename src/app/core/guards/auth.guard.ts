import { CanActivateFn } from '@angular/router';

// TODO: guards a demo login flag, not a real session/token. See login.ts for why
// real Jamendo OAuth isn't wired up yet.
export const authGuard: CanActivateFn = () => {
  return !!localStorage.getItem('isAuthenticated');
};
