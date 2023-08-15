import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable} from 'rxjs';
import { Store } from "@ngrx/store";
import { AuthState } from "../models/auth/auth-state";
import { isAuthenticated$ } from "../../store/selectors/auth.selectors";
import {ROUTE_PATH} from "../models/global.constants";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private store$: Store<AuthState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store$.select(isAuthenticated$).pipe(
      map((authenticated) => {
        if (authenticated) {
          // void this.router.navigate([`/${ROUTE_PATH.home}`]);
          return true;
        }
        return true;
        // return false;
      })
    );
  }

}
