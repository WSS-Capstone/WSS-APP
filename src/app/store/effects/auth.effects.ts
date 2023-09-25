import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { Router } from '@angular/router';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
} from '../actions/auth.actions';
import { catchError, finalize, from, map, of, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginRequest } from '../../core/models/auth/login-request';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private auth: AngularFireAuth,
    private loadingService: LoadingService,
    private router: Router,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      tap(() => this.loadingService.show()),
      switchMap(({ data }) => this.performFirebaseAuth(data)),
      switchMap((data: LoginRequest | any) => this.performBackendAuth(data)),
    ),
  );

  private performFirebaseAuth(data: LoginRequest) {
    return from(
      this.auth.signInWithEmailAndPassword(data.email, data.password),
    ).pipe(
      catchError((error) => this.handleFirebaseAuthError(error)),
      switchMap((res: UserCredential | any) => this.fetchIdToken(res)),
      map((token: string | any) => this.storeFirebaseToken(token, data)),
    );
  }

  private handleFirebaseAuthError(error: any) {
    this.loadingService.hide();
    this.authService.clearLoginSuccessFirebase();
    return of(loginFailure({ error: 'Sai thông tin đăng nhập' }));
  }

  private fetchIdToken(res: UserCredential | any) {
    return from(res.user.getIdToken());
  }

  private storeFirebaseToken(token: string | any, data: LoginRequest) {
    console.log(token);
    this.authService.setLoginSuccessFirebase(
      { idToken: token },
      data.isRememberMe,
    );
    return data;
  }

  private performBackendAuth(data: LoginRequest | any) {
    return this.authService.login(data).pipe(
      map(({ user, token }) =>
        this.handleBackendAuthSuccess(user, token, data),
      ),
      catchError((error) => this.handleBackendAuthError(error)),
      finalize(() => this.loadingService.hide()),
    );
  }

  private handleBackendAuthSuccess(
    user: any,
    token: string | any,
    data: LoginRequest,
  ) {
    this.authService.setLoginSuccessValue(token, data.isRememberMe);
    void this.router.navigateByUrl('/app');
    return loginSuccess({ user, token });
  }

  private handleBackendAuthError(error: any) {
    return of(loginFailure({ error: 'Sai thông tin đăng nhập' }));
  }

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      switchMap(() => this.authService.logout()),
      map(() => logoutSuccess()),
    ),
  );
}
