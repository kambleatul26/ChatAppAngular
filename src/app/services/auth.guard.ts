import { DataService } from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private data: DataService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data.role;
 
    return this.authService.user.pipe(
      take(1),
      map(user => {
        if (user) {
          const role = user.role;
          if (expectedRole && expectedRole === role) {
            return true;
          } else {
            this.data.showAlert('You are not authorized to visit this page', 'Okay');
            return this.router.parseUrl('/login');
          }
        } else {
          this.data.showAlert('You are not authorized to visit this page', 'Okay');
          return this.router.parseUrl('/login');
        }
      })
    );
  }
}