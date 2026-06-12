import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../../services/toast/toast';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;

        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toastService.show('Session expired. Please login again.', 'error');
          router.navigate(['/login']);
        }
      }

      if (error.status !== 401) {
        toastService.show(errorMessage, 'error');
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
