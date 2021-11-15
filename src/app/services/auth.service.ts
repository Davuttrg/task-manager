import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  isLoggedIn(): Observable<boolean> {
    return of(true);
    // let decodedToken = this.getDecodeToken();
    // if (decodedToken && new Date() < new Date(decodedToken.exp * 1000)) {
    //   return of(true);
    // }
    // return of(false);
  }

  getDecodeToken(): any {
    let decoded;
    try {
      decoded = jwt_decode(localStorage.getItem('auth_token') as string);
    } catch (error) {
      console.log('Jwt error ', error);
    }
    return decoded;
  }
  logout(){
    localStorage.clear();
  }
}
