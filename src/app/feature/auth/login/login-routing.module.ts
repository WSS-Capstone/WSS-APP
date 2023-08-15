import { NgModule } from '@angular/core';
import {LoginViewComponent} from "./views/login/login.view.component";
import {RouterModule} from "@angular/router";

const routes = [
  {
    path: '',
    component: LoginViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule { }
