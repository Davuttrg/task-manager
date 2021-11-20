import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  me: any;
  loading: boolean = true;
  constructor(private _router: Router, public _auth: AuthService) {}
  ngOnInit() {
    this._auth.getState();
    this._auth.$getactiveUser.pipe().subscribe((data: any) => {
      if (data != null) {
        // subsc.unsubscribe();
        this.me = data;
      } else this.me = undefined;
      this.loading = false;
    });
  }

  login() {
    console.log('login');
    this._router.navigate(['login']);
  }
  logOut() {
    this.loading = true;
    this._auth.logOut();
    setTimeout(() => {
      this.me = undefined;
      this.loading = false;
      this._router.navigate(['/login']);
    }, 1000);
  }
}
