import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthLayoutComponent } from './layouts';
import { MainLayoutComponent } from './layouts';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./modules/auth/login/login.module').then(
            (m) => m.LoginModule,
          ),
        canActivate: [NoAuthGuard],
      },
      {
        path: 'sign-up',
        loadChildren: () =>
          import('./modules/auth/sign-up/sign-up.module').then(
            (m) => m.SignUpModule,
          ),
        canActivate: [NoAuthGuard],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'categories',
        loadChildren: () =>
          import('./modules/category/categories.module').then(
            (m) => m.CategoriesModule,
          ),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./modules/service/service.module').then(
            (m) => m.ServiceModule,
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/order/order.module').then((m) => m.OrderModule),
      },

      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'categories',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
