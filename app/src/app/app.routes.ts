import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';

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
                path: 'profile',
                component: ProfileComponent
            },
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    },
];
