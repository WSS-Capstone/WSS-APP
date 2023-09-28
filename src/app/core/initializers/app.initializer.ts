import { Inject, Injectable } from '@angular/core';
import { iif, map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { GLOBAL_CONSTANTS } from '../models/global.constants';

@Injectable()
export class AppInitializer {
  constructor(
    @Inject(Store) private store$: Store,
    @Inject(StorageService) private storageService: StorageService,
    @Inject(AuthService) private authService: AuthService,
  ) {
    console.log('AppInitializer');
  }

  auth(): Observable<any> {
    console.log('AppInitializer auth');
    const token = this.storageService.getCookieByName(GLOBAL_CONSTANTS.idToken);

    return of(token).pipe(
      map(() => {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.exp < Math.floor(Date.now() / 1000);
        } catch (e) {
          return true;
        }
      }),
      switchMap((isExpired) => iif(() => isExpired, of(false), of(true))),
    );
  }
}

export function initializeTokenFactory(
  appInitializer: AppInitializer,
): () => Observable<string> {
  return () => appInitializer.auth();
}
