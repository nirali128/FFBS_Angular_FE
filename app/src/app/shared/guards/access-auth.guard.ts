import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AccessAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.authService.getRole();
    const allowedRoles: string[] = route.data['visibleTo'];
    if (allowedRoles && allowedRoles.includes(role)) {
      return true;
    } 
    this.router.navigateByUrl('not-found');
    return false;
  }
}
