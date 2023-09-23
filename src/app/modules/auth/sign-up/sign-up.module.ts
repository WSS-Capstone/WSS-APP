import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupContainerComponent} from './container/signup-container/signup-container.component';
import {SignupFormComponent} from './components/signup-form/signup-form.component';
import {SignupRoutingModule} from "./sign-up-routing.module";
import {SignUpViewComponent} from "./views/sign-up/sign-up.view.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";

const COMPONENTS = [SignupFormComponent];
const CONTAINERS = [SignupContainerComponent];

const VIEWS = [SignUpViewComponent];


@NgModule({
  declarations: [
    ...VIEWS, ...CONTAINERS, ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule
  ]
})
export class SignUpModule {
}
