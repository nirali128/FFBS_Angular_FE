import {
    HttpErrorResponse,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        public authService: AuthService,
        private dialog: MatDialog,
        public matSnackBar: MatSnackBar
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    return this.handleUnauthorized();
                } else if (error.status === 390) {
                    return this.handleErrorCode390(error);
                } else if (error.status === 400) {
                    return this.handleBadRequest(error);
                }
                return throwError(error);
            })
        );
    }

    private handleUnauthorized(): Observable<never> {
        this.showSnackbar('Unauthorized or Forbidden access');
        return throwError('Unauthorized or Forbidden access');
    }

    private handleErrorCode390(error: HttpErrorResponse): Observable<never> {
        const errorCode = error.error?.errorCode;
        if (errorCode) {
            this.showSnackbar(`Error code: ${errorCode}`);
            return throwError(`error.${errorCode}`);
        }
        return throwError(error); // If no specific errorCode, return the original error
    }

    private handleBadRequest(error: HttpErrorResponse): Observable<never> {
        const errorParams = error.error?.invalidParams;
        if (errorParams && errorParams.length > 0) {
            const message = errorParams[0].description;
            this.showSnackbar(message);
        }
        return throwError(error);
    }

    private showSnackbar(message: string): void {
        this.matSnackBar.open(message, '', {
            duration: 5000,
            panelClass: 'snackbar-error',
        });
    }
}
