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
import { AppLoaderService } from '../service/app-loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  constructor(
    public authService: AuthService,
    private loaderService: AppLoaderService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.showLoader();
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
          this.refreshTokenInProgress = true;

          let refreshTokenValue = this.authService.getRefreshToken();
          if(refreshTokenValue)
          this.authService
            .refreshToken(refreshTokenValue)
            .subscribe((res) => {
              if (res.success) {
                this.authService.setToken(res.data);
                this.refreshTokenInProgress = false;
              }
            });
        }
      }
    }
    this.loaderService.hideLoader();
    return next.handle(request);
  }
}
