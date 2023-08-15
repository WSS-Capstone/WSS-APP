import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {
    console.log('Start time: ', new Date().getTime());
  }

  show(): void {
    this.isLoading$.next(true);
  }

  hide(): void {
    this.isLoading$.next(false);
  }

  /**
   * Loading status
   */
  get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
