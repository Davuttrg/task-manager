import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable, of, Subject } from 'rxjs';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _firebase: FirebaseService) {}
  me: any;
  $getactiveUser = new Subject();
  getactiveUser() {
    this.$getactiveUser.next(this.me);
  }
  isLoggedIn(): Observable<boolean> {
    // return of(true);
    let decodedToken = this.getDecodeToken();
    if (decodedToken && new Date() < new Date(decodedToken.exp * 1000)) {
      return of(true);
    }
    return of(false);
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
  register(user: { email: string; password: string }) {
    let auth = getAuth();
    return createUserWithEmailAndPassword(auth, user.email, user.password);
  }
  login(user: { email: string; password: string }) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, user.email, user.password);
  }
  getState() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let fireUser = await this._firebase.getUser(user.uid);
        this.me = fireUser;
        this.$getactiveUser.next(this.me);
      } else {
        this.$getactiveUser.next(null);
      }
    });
  }
  logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.me = undefined;
        localStorage.removeItem('auth_token');
        this.$getactiveUser.next(null);
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem('auth_token');
        this.$getactiveUser.next(null);
      });
  }
}
export namespace ErroAuthEn {
  export function convertMessage(code: string): string {
    console.log(code);
    switch (code) {
      case 'auth/user-disabled': {
        return 'Sorry your user is disabled';
      }
      case 'auth/user-not-found': {
        return 'Sorry user not found';
      }
      case 'auth/invalid-email': {
        return 'Invalid Email';
      }
      case 'auth/internal-error': {
        return 'Missing Fields';
      }
      case 'auth/wrong-password': {
        return 'Wrong Password';
      }
      default: {
        return 'Login error try again later';
      }
    }
  }
}
