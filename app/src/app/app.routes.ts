import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { BookingListComponent } from './pages/field/booking/booking-list/booking-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { InvoiceListComponent } from './pages/invoice-list/invoice-list.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AccessAuthGuard } from './shared/guards/access-auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { Role } from './shared/enum/role';
import { FeedbackListComponent } from './pages/feedback/list/feedback-list.component';

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
                    visibleTo: [Role.Admin, Role.Customer]
                },
                loadChildren: () => import('./pages/dashboard/dashboard.routes')
            },
            {
                path:'field',
                title: 'Field',
                data: {
                    icon: 'sports_soccer',
                    title: 'Field',
                    visibleTo: [Role.Admin, Role.Customer]
                },
                loadChildren: () => import('./pages/field/field.routes')
            },
            {
                path:'booking-list',
                title: 'Booking',
                data: {
                    icon: 'event',
                    title: 'Booking',
                    visibleTo: [Role.Admin, Role.Customer]
                },
                component: BookingListComponent
            },
            {
                path: 'profile',
                title: 'Profile',
                component: ProfileComponent
            },
            {
                path:'invoice-list',
                title: 'Invoice',
                data: {
                    icon: 'receipt_long',
                    title: 'Invoice',
                    visibleTo: [Role.Admin]
                },
                component: InvoiceListComponent,
                canActivate: [AccessAuthGuard]
            },
            {
                path: 'user-list',
                title: 'User',
                data: {
                    icon: 'person',
                    title: 'User',
                    visibleTo: [Role.Admin]
                },
                component: UserListComponent
            },
            {
                path: 'feedback-list',
                title: 'Feedback',
                data: {
                    icon: 'feedback',
                    title: 'Feedback',
                    visibleTo: [Role.Customer]
                },
                canActivate: [AccessAuthGuard],
                component: FeedbackListComponent
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
