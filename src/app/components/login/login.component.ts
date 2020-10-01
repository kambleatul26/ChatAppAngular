import { DataService } from 'src/app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public formError: string = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private data: DataService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      isManager: [false, Validators.compose([Validators.required])],
    });
  }

  loginUser(loginDetails) {
    let user = { id: '' , role: '', token: '', name: ''};

    this.loading = true;
    this.auth.loginUser(loginDetails)
      .subscribe(res => {
        console.log(res);
        setTimeout(() => {
          this.loading = false;
          user.token = res['token'];
          user.id = res['id'];
          user.name = res['name'];
          if(res['isManager'] == true) {
            user.role = 'manager';
          } else {
            user.role = 'customer';
          }
          this.auth.authenticationState.next(user);
          localStorage.setItem(TOKEN_KEY, JSON.stringify(user));
          this.router.navigate(['chat']);
        }, 100);
      }, err => {
        setTimeout(() => {
          this.loading = false;
          this.formError = err.error.message;
          console.log(err);
        }, 100);
      })
  }

  registerUser(registerDetails) {
    this.loading = true;
    this.auth.signUp(registerDetails)
      .subscribe(res => {
        console.log(res);
        setTimeout(() => {
          this.loading = false;
          this.data.showAlert('Login with your credentials', 'Okay!');
        }, 100);
      }, err => {
        setTimeout(() => {
          this.loading = false;
          this.formError = err.error.message;
          console.log(err);
        }, 100);
      })
  }

  ngOnInit() {
    this.formError = null;
  }

}
