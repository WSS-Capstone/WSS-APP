import { AuthState } from '../models/auth/auth-state';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { isAuthenticated$ } from '../../store/selectors/auth.selectors';
import { ROUTE_PATH } from '../models/global.constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private store$: Store<AuthState>,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store$.select(isAuthenticated$).pipe(
      map((authenticated) => {
          console.log('authenticated', authenticated)

        if (!authenticated) {
          void this.router.navigate([`/${ROUTE_PATH.login}`]);
          return false;
        }
        return true;
      }),
    );
  }
}
