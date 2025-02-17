import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';

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
                path:'address-form',
                title: 'Address Form',
                data: {
                    icon: 'home',
                    title: 'Address Form'
                },
                loadChildren: () => import('./pages/address-form/address-form.routes')
            },
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    },
];
