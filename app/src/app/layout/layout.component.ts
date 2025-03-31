import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { routes } from '../app.routes';
import { RouteData } from '../shared/interfaces/route.data';
import { ButtonComponent } from '../shared/components/button/button.component';
import { AuthService } from '../shared/service/authentication.service';
import { AppSpinnerComponent } from '../shared/components/app-spinner/app-spinner.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    CommonModule,
    ButtonComponent,
    AppSpinnerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  routes: Routes = routes
    .filter((x) => x?.children && x?.children.length > 0)[0]
    ?.children?.filter(
      (r) => r.path && r.path !== '**' && r.path !== 'profile'
    );
  actualRoute!: RouteData;
  isHandset$: Observable<boolean>;
  username!: string;

  constructor(
    public breakpointObserver: BreakpointObserver,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay()
    );
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.routerSubscribe()
  }

  ngOnChanges() {
    this.routerSubscribe();
  }

  routerSubscribe() {
    const role = this.authService.getRole();

    this.routes = this.routes.filter((route) => {
      return route.data['visibleTo']?.includes(role);
    });
    this.router.events.subscribe(() => {
      if (this.routes.length) {
        const data = this.routes.find(
          (r) => r.path === this.route.snapshot.firstChild?.routeConfig?.path
        ) as RouteData;
        this.actualRoute = { title: data.title, icon: data.icon };
      }
    });
  }

  signOut() {
    this.authService.clearToken();
    this.router.navigateByUrl('/login');
  }

  navigateToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
