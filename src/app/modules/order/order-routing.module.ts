import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrderListViewComponent } from './view/order-list-view/order-list-view.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
