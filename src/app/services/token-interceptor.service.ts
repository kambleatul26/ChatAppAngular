import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(this.auth.isAuthenticated());
    if (this.auth.isAuthenticated()) {
      // console.log('HHH');
      request = request.clone({
        setHeaders: {
          Authorization : `token ${this.auth.isAuthenticated().token}`,
        }
      });
    }

    // console.log(request);
    return next.handle(request);
  }
  constructor(private auth: AuthService) { }
}