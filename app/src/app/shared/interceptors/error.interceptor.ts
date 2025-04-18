import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/authentication.service';
import { SnackbarService } from '../service/snackbar.service';
import { SnackbarConfig } from '../constants/snackbar-config.const';
import { ErrorMessages } from '../constants/messages-const';
import { GlobalConstant } from '../constants/global-const';
import { ApiResponse } from '../interfaces/api.response';

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
        if (request.url.includes(GlobalConstant.BOOKING.GET_BOOKING_BY_FIELDID_USERID)) {

          const apiResponse: ApiResponse<any> = {
            success: false,
            message: message,
            data: []
          };
    
          return of(new HttpResponse({ 
            status: 200,
            body: apiResponse 
          }));
        }

        
        if (!error.error.success && message) {
          this.snackBarService.show(
            new SnackbarConfig({
              status: 'error',
              message: message,
              icon: 'warning_amber',
            })
          );
        } else {
          this.snackBarService.show(
            new SnackbarConfig({
              status: 'error',
              message: ErrorMessages.SOMETHING_WENT_WRONG,
              icon: 'warning_amber',
            })
          );
        }
        return throwError(error);
      })
    );
  }
}