import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/authentication.service';
import { GlobalConstant } from '../constants/global-const';
import { Role } from '../enum/role';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  constructor(public authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn()) {
      request = request.clone({
        setHeaders: {
          Authorization: `${
            GlobalConstant.BEARER
          } ${this.authService.getToken()}`,
        },
      });

      let expiryTimeValue = this.authService.getExpiryTime();
      if (expiryTimeValue) {
        const expiryTime = new Date(expiryTimeValue);
        if (
          new Date(new Date().toUTCString()) > expiryTime &&
          !this.refreshTokenInProgress
        ) {
          // this.refreshTokenInProgress = true;

          // this.authService
          //   .refreshToken(localStorage.getItem('refreshToken') || '')
          //   .subscribe((res) => {
          //     if (res.success) {
          //       this.authService.setToken(res.data);
          //       this.refreshTokenInProgress = false;
          //     }
          //   });
        }
      }
    }
    return next.handle(request);
  }
}
