import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from "./core/guards/no-auth.guard";
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./feature/auth/login/login.module').then((m) => m.LoginModule),
        canActivate: [NoAuthGuard],
      },
      // {
      //   path: 'sign-up',
      //   loadChildren: () => import('./features/auth/sign-up/sign-up.module').then((m) => m.SignUpModule),
      //   canActivate: [NoAuthGuard],
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
