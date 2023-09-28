import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {LoadingService} from "./core/services/loading.service";
import {DestroyService} from "./core/services/destroy.service";
import {AuthState} from "./core/models/auth/auth-state";
import {takeUntil} from "rxjs";
import {AuthService} from "./core/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DestroyService],
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'wedding-service-app';
  isLoading = false;
   constructor(
     private loadingService: LoadingService,
     private readonly destroy$: DestroyService,
     private authService: AuthService,
     private ref: ChangeDetectorRef,
   ) { }

  ngOnInit(): void {
    this.loadingService.isLoading.pipe(takeUntil(this.destroy$)).subscribe((isLoading) => {
      this.isLoading = isLoading;
      this.ref.detectChanges();
    });

    //if token is expired, renew token
    this.authService.checkToken();
    this.authService.checkUserInfo();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // Check if the user click remember me
    // this.authStore$
    //   .select(rememberMe$)
    //   .pipe(
    //     filter((isRememberMe) => !isRememberMe),
    //     tap({
    //       next: () => {
    //         console.log('not check remember me run');
    //
    //         // not check -> force user to logout
    //         this.authStore$.dispatch(logout());
    //       },
    //     }),
    //     take(1)
    //   )
    //   .subscribe();
  }
}
