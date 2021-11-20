import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService, ErroAuthEn } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  passwordVisibility: boolean = false;

  loadings = {
    login: false,
    register: false,
  };

  constructor(
    private _formBuilder: FormBuilder,
    private _auth: AuthService,
    private _alertify: AlertifyService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.createForms();
    this._auth.isLoggedIn().subscribe((response) => {
      if (response) {
        this._router.navigate(['/home']);
      }
    });
  }
  createForms() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // gender: [''],
    });
  }

  login(formData: any) {
    this.loadings.login = true;
    this._auth
      .login(formData)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user as any;
        this._auth.me = user;
        localStorage.setItem('auth_token', user.accessToken);
        console.log('user :', user);
        this._alertify.success('Login Success');
        setTimeout(() => {
          this._router.navigate(['/board']);
        }, 1000);
        this.loadings.login = false;
        // ...
      })
      .catch((error) => {
        this._alertify.error(ErroAuthEn.convertMessage(error.code));
        this.loadings.login = false;
      });
  }
  register(formData: any) {
    this.loadings.register = true;

    this._auth
      .register(formData)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user as any;
        this._auth.me = user;
        localStorage.setItem('auth_token', user.accessToken);
        this.loadings.register = false;
        this._alertify.success('Registiration Success');
        setTimeout(() => {
          this._router.navigate(['/board']);
        }, 1000);
      })
      .catch((error) => {
        this._alertify.error(ErroAuthEn.convertMessage(error.code));
        console.log('error :', error);
        this.loadings.register = false;
      });
  }
}
