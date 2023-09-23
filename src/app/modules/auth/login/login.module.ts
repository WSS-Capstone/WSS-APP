import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LoginRoutingModule} from "./login-routing.module";
import {LoginViewComponent} from './views/login/login.view.component';
import {LoginContainerComponent} from './containers/login/login.container.component';
import {LoginFormComponent} from "./components/login-form/login-form.component";
import {LogoWithTitleComponent} from "../../../shared/components/logo-with-title/logo-with-title.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TwoButtonComponent} from "../../../shared/components/two-button/two-button.component";
import {MatButtonModule} from "@angular/material/button";

const COMPONENTS = [LoginFormComponent, LogoWithTitleComponent, TwoButtonComponent];
const CONTAINERS = [LoginContainerComponent];

const VIEWS = [LoginViewComponent];

@NgModule({
  declarations: [
    ...VIEWS, ...CONTAINERS, ...COMPONENTS
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    NgOptimizedImage,
  ]
})
export class LoginModule {
}
