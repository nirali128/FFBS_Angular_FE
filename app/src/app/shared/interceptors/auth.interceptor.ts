import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../service/authentication.service';
import * as momentTimezone from 'moment-timezone';
import { GlobalConstant } from '../constants/global-const';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
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
                    TimeZone: momentTimezone.tz.guess(),
                },
            });
        } else {
            request = request.clone({
                setHeaders: {
                    TimeZone: momentTimezone.tz.guess(),
                },
            });
        }
        return next.handle(request);
    }
}
