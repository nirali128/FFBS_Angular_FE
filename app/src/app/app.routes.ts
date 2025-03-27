import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CalendarComponent } from './shared/components/calendar/calendar.component';
import { BookingListComponent } from './pages/field/booking/booking-list/booking-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserListComponent } from './pages/user-list/user-list.component';

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
            {
                path:'booking-list',
                title: 'Booking',
                data: {
                    icon: 'home',
                    title: 'Booking'
                },
                component: BookingListComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'user-list',
                title: 'User',
                data: {
                    icon: 'home',
                    title: 'User'
                },
                component: UserListComponent
            },
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    },
];
