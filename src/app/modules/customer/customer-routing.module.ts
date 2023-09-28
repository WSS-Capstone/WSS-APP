import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CustomerListViewComponent} from "./view/customer-list-view/customer-list-view.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerListViewComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
