import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomerRoutingModule} from "./customer-routing.module";
import {CustomerListViewComponent} from "./view/customer-list-view/customer-list-view.component";

const containers = [];
const views = [CustomerListViewComponent];
const pipes = [];
const directives = [];

@NgModule({
  declarations: [...containers, ...views],
  imports: [
    ...pipes,
    ...directives,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomerRoutingModule,
  ],
  providers: [],
})
export class CustomerModule {}
