import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/authentication.service';
import { Role } from '../enum/role';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
      if (this.authService.isLoggedIn()) {
        return true;
      } else {
        this.router.navigateByUrl('login');
      }
    return false;
  }
}
