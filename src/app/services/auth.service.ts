import { DataService } from 'src/app/services/data.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { filter, take, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>;
  public authenticationState = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private data: DataService,
  ) {
    // RETURN VALUES THAT ARE NOT NULL (TO AVOID FIRST NULL VALUE)
    this.user = this.authenticationState.asObservable().pipe(
      filter(response => response)
    );
  }

  loadUser() {
    let usr = localStorage.getItem(TOKEN_KEY);
    usr = JSON.parse(usr);
    if (usr) {
      this.authenticationState.next(usr);
      this.router.navigate(['chat']);
      this.data.setupSocket(usr['id']);
      // if (usr && usr['role'] == "user") {

      // } else {

      // }
    } else {
      this.router.navigate(['login']);
      this.authenticationState.next(null);
    }
  }

  loginUser(credentials) {
    // console.log(credentials);    
    const email = credentials.email;
    const password = credentials.password;
    const loginURL = environment.URL + 'api/auth/login';
    return this.http.post(loginURL, {
      email,
      password
    }).pipe(take(1), map(value => {
      console.log(value);
      return value;
    }));
  }

  signUp(credentials) {
    // console.log(credentials);    
    const name = credentials.name;
    const email = credentials.email;
    const password = credentials.password;
    const isManager = credentials.isManager;
    const registerURL = environment.URL + 'api/auth/register';
    return this.http.post(registerURL, {
      name,
      email,
      password,
      isManager
    }).pipe(take(1), map(value => {
      console.log(value);
      return value;
    }));
  }

  async logout() {
    await localStorage.setItem(TOKEN_KEY, null);
    this.authenticationState.next(null);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
}