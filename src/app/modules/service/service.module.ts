import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceRoutingModule } from './service-routing.module';
import {ServiceListViewComponent} from "./view/service-list-view/service-list-view.component";

const containers = [];
const views = [ServiceListViewComponent];
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
    ServiceRoutingModule,
  ],
  providers: [],
})
export class ServiceModule {}
