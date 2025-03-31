import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/authentication.service';
import { Role } from '../enum/role';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let role = this.authService.getRole();
    if (role == Role.Admin) {
      return true;
    } else {
      this.router.navigateByUrl('not-found');
    }
    return false;
  }
}
