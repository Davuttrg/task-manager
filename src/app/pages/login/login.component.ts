import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService, ErroAuthEn } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

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
    private _router: Router,
    private _firebase: FirebaseService
  ) {}

  ngOnInit(): void {
    this.createForms();
    this._auth.isLoggedIn().subscribe((response) => {
      if (response) {
        this._router.navigate(['/board']);
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
      gender: [''],
    });
  }

  login(formData: any) {
    if (this.loginForm.invalid) return;
    this.loadings.login = true;
    this._auth
      .login(formData)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user as any;
        let fireUser = await this._firebase.getUser(user.uid);
        this._auth.me = fireUser;
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
    if (this.registerForm.invalid) return;
    this.loadings.register = true;
    this._auth
      .register(formData)
      .then(async (userCredential) => {
        formData['username'] = formData['email'].split('@')[0];
        formData['uid'] = userCredential.user.uid;
        delete formData['password'];
        await this._firebase.addData('user', formData);
        const user = userCredential.user as any;
        let fireUser = await this._firebase.getUser(user.uid);
        console.log('fireUser :', fireUser);
        this._auth.me = fireUser;
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
