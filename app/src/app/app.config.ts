import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
        withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(
        routes
    ),
    provideAnimationsAsync(),
    {
        provide:
        MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
            floatLabel: 'always',
            appearance: 'outline',
        },
    },
    {
        provide: MAT_DATE_LOCALE,
        useValue: 'en-US',
    },
    {
        provide: MAT_DATE_FORMATS,
        useValue: {
            parse: {
                dateInput: 'YYYY-MM-DD',
            },
            display: {
                dateInput: 'YYYY-MM-DD',
                monthYearLabel: 'LLL yyyy',
                dateA11yLabel: 'DD',
                monthYearA11yLabel: 'LLLL yyyy',
            },
        },
    },]
};
