import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {OrderRoutingModule} from "./order-routing.module";
import {OrderListViewComponent} from "./view/order-list-view/order-list-view.component";

const containers = [];
const views = [OrderListViewComponent];
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
    OrderRoutingModule,
  ],
  providers: [],
})
export class OrderModule {}
