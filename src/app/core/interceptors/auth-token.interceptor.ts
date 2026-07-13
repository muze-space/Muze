import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken && !req.url.includes('jamendo.com')) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    if (isDevMode()) console.debug(`[Auth] Token added to request: ${req.url}`);
  }

  return next(req);
};
