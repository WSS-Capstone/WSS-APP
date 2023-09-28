import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ServiceListViewComponent } from './view/service-list-view/service-list-view.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceListViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
