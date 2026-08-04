import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.debug(`[ErrorInterceptor] Unauthorized request: ${req.url}`);
        toastService.show('You are not authorized to perform this action.');
      } else if (error.status >= 500) {
        console.debug(`[ErrorInterceptor] Server error: ${req.url}`);
        toastService.show('Server error. Please try again later.');
      } else if (error.status === 0) {
        toastService.show('Network error. Unable to reach the server.');
      }
      return throwError(() => error); // rethrow so the calling code can also handle it
    }),
  );
};
