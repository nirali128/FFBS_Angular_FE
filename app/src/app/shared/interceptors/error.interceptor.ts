import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/authentication.service';
import { SnackbarService } from '../service/snackbar.service';
import { SnackbarConfig } from '../constants/snackbar-config.const';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public authService: AuthService,
    private snackBarService: SnackbarService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message;
        if (!error.error.success) {
          this.snackBarService.show(
            new SnackbarConfig({
              status: 'error',
              message: message,
              icon: 'warning_amber',
            })
          );
        }
        return throwError(error);
      })
    );
  }
}