import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {SignUpViewComponent} from "./views/sign-up/sign-up.view.component";

const routes = [
  {
    path: '',
    component: SignUpViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRoutingModule {
}
