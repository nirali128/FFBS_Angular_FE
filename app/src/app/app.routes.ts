import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { BookingListComponent } from './pages/field/booking/booking-list/booking-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminAuthGuard } from './shared/guards/admin-auth.guard';
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
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                data: {
                    icon: 'desktop_windows',
                    title: 'Dashboard',
                    visibleTo: ['Admin', 'Customer']
                },
                loadChildren: () => import('./pages/dashboard/dashboard.routes')
            },
            {
                path:'field',
                title: 'Field',
                data: {
                    icon: 'list',
                    title: 'Field',
                    visibleTo: ['Admin', 'Customer']
                },
                loadChildren: () => import('./pages/field/field.routes')
            },
            {
                path:'booking-list',
                title: 'Booking',
                data: {
                    icon: 'list',
                    title: 'Booking',
                    visibleTo: ['Admin', 'Customer']
                },
                component: BookingListComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path:'invoice-list',
                title: 'Invoice',
                data: {
                    icon: 'list',
                    title: 'Invoice',
                    visibleTo: ['Admin']
                },
                component: InvoiceListComponent,
                canActivate: [AdminAuthGuard]
            },
            {
                path: 'user-list',
                title: 'User',
                data: {
                    icon: 'list',
                    title: 'User',
                    visibleTo: ['Admin']
                },
                component: UserListComponent
            },
            {path: '**', component: NotFoundComponent},
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
        ]
    },
];
