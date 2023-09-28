import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../models/auth/auth-state';
import { LoginRequest } from '../models/auth/login-request';
import { environment } from '../../../environments/environment';
import {
  ENDPOINTS,
  GLOBAL_CONSTANTS,
  ROUTE_PATH,
} from '../models/global.constants';
import { map, of, tap } from 'rxjs';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';
import {
  loginSuccess,
  renewToken,
  setUserInfo,
} from '../../store/actions/auth.actions';
import { IToken, IUser } from '../models/user/user';
import { LoginInfo } from '../../modules/auth/login/models/models';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private readonly storageService: StorageService,
    private auth: AngularFireAuth,
    private store: Store<AuthState>,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  private renewTokenTimeout;

  login(loginRequest: LoginRequest) {
    let token = this.storageService.getCookieByName(GLOBAL_CONSTANTS.idToken);

    return this.apiService
      .get<LoginInfo>(`${environment.wssApi}/${ENDPOINTS.login}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((res) => {
          const {
            id,
            username,
            refId,
            roleName,
            status,
            customer,
            partner,
            owner,
          } = res;

          const user: IUser = {
            id,
            email: username,
            phone: customer?.phone ?? partner?.phone ?? owner?.phone,
            fullname:
              customer?.fullname ?? partner?.fullname ?? owner?.fullname,
            roleName,
            isActive: status === 'Active',
          };
          const token: IToken = {
            idToken: this.storageService.getCookieByName(
              GLOBAL_CONSTANTS.idToken,
            ),
          };

          this.storageService.setCookie(
            GLOBAL_CONSTANTS.emailCookieName,
            JSON.stringify(user),
          );
          return {
            user,
            token,
          };
        }),
      );
  }

  loginWithGoogle() {
    // return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    return of(true).pipe(
      tap({
        next: () => {
          this.storageService.removeCookie(GLOBAL_CONSTANTS.idToken);
          this.storageService.removeCookie(GLOBAL_CONSTANTS.emailCookieName);
          this.storageService.removeLocalStorage(GLOBAL_CONSTANTS.expiredTime);
          this.storageService.removeLocalStorage(GLOBAL_CONSTANTS.rememberMe);
          this.dialogService.closeAll();
          //stop automatically renew token when logout
          this.auth.signOut();
          this.stopRenewTokenTimer();
          void this.router.navigate([`/${ROUTE_PATH.login}`]);
        },
      }),
    );
  }

  stopRenewTokenTimer() {
    clearTimeout(this.renewTokenTimeout);
  }

  checkUserInfo() {
    const user = this.storageService.getCookieByName(
      GLOBAL_CONSTANTS.emailCookieName,
    );
    if (!!user) {
      const userInfo = JSON.parse(user);
      this.store.dispatch(setUserInfo({ user: userInfo }));
    }
  }

  renewToken() {
    const token = this.storageService.getCookieByName(GLOBAL_CONSTANTS.idToken);
    if (this.isTokenExpired(token) || !token) {
      of(this.auth.onIdTokenChanged).pipe(
        tap({
          next: (user: any) => {
            user.getIdToken().then((idToken) => {
              this.storageService.setCookie(GLOBAL_CONSTANTS.idToken, idToken);
              return idToken;
            });
          },
          error: () => {
            this.logout();
            return null;
          },
        }),
      );
    }
    return token;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch (e) {
      return true;
    }
  }

  checkToken() {
    const token = this.storageService.getCookieByName(GLOBAL_CONSTANTS.idToken);
    console.log('checkToken', token);
    if (this.isTokenExpired(token) || !token) {
      // this.logout();
      // this.store.dispatch(renewToken());
      void this.router.navigate([`/${ROUTE_PATH.login}`]);
      return;
    } else {
      this.setLoginSuccessValue({ idToken: token } as IToken);
    }

    // this.store.dispatch(renewToken());
  }

  setLoginSuccessFirebase(token: IToken, rememberMe?: boolean) {
    this.storageService.setCookie(GLOBAL_CONSTANTS.idToken, token.idToken);
    if (rememberMe) {
      this.storageService.setLocalStorage(
        GLOBAL_CONSTANTS.rememberMe,
        rememberMe,
      );
    }
  }

  clearLoginSuccessFirebase() {
    this.storageService.removeCookie(GLOBAL_CONSTANTS.idToken);
  }

  getToken() {
    return this.storageService.getCookieByName(GLOBAL_CONSTANTS.idToken);
  }

  setLoginSuccessValue(token: IToken, rememberMe?: boolean) {
    // const expiredTime = new Date().getTime() + token.expiresIn * 1000;
    // set tokens in cookie and expiredTime in localStorage
    // this.storageService.setLocalStorage(GLOBAL_CONSTANTS.expiredTime, expiredTime);
    this.storageService.setCookie(GLOBAL_CONSTANTS.idToken, token.idToken);

    if (rememberMe) {
      this.storageService.setLocalStorage(
        GLOBAL_CONSTANTS.rememberMe,
        rememberMe,
      );
    }
    const userS = this.storageService.getCookieByName(
      GLOBAL_CONSTANTS.emailCookieName,
    );
    const user: IUser = JSON.parse(userS);
    this.store.dispatch(loginSuccess({ user, token }));
    // call function that will automatically renew token before it expires.
    // this.startRenewTokenTimer(expiredTime);
  }
}
