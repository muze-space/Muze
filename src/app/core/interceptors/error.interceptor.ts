import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.debug(`[ErrorInterceptor] Unauthorized request: ${req.url}`);
      } else if (error.status >= 500) {
        console.debug(`[ErrorInterceptor] Server error: ${req.url}`);
      }
      return throwError(() => error); // rethrow so the calling code can also handle it
    }),
  );
};
