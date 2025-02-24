import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(
        routes,
        withPreloading(PreloadAllModules),
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
