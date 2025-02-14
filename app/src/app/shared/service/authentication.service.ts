import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private router: Router) {}

    isLoggedIn(): boolean {
        return !!localStorage.getItem('');
    }

    getToken(): string {
        return localStorage.getItem('') ?? '';
    }

    clearToken() {
        localStorage.clear();
    }

    decodedToken() {
        return jwtDecode(this.getToken());
    }
}
