import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CalendarComponent } from './shared/components/calendar/calendar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'register'},
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                data: {
                    icon: 'desktop_windows',
                    title: 'Dashboard'
                },
                loadChildren: () => import('./pages/dashboard/dashboard.routes')
            },
            {
                path:'field',
                title: 'Field',
                data: {
                    icon: 'home',
                    title: 'Field'
                },
                loadChildren: () => import('./pages/field/field.routes')
            },
            {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
        ]
    },
    {path: '**', component: NotFoundComponent}
];
