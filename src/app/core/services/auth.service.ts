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
import { setUserInfo } from '../../store/actions/auth.actions';
import { IToken, IUser } from '../models/user/user';
import { LoginInfo } from '../../modules/auth/login/models/models';
import { idToken } from '@angular/fire/auth';
import { plainToClass } from 'class-transformer';

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
    return this.apiService
      .post<LoginInfo>(`${environment.wssApi}/${ENDPOINTS.login}`, loginRequest)
      .pipe(
        map((res) => {
          const { email, phone, fullname, roleName, isActive } = res;
          const user: IUser = {
            email,
            phone,
            fullname,
            roleName,
            isActive,
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
    // this.storageService.setCookie(GLOBAL_CONSTANTS.idToken, token.idToken);

    if (rememberMe) {
      this.storageService.setLocalStorage(
        GLOBAL_CONSTANTS.rememberMe,
        rememberMe,
      );
    }

    // call function that will automatically renew token before it expires.
    // this.startRenewTokenTimer(expiredTime);
  }
}
