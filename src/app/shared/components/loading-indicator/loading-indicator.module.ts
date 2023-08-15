import { NgModule } from '@angular/core';
import {LoadingIndicatorComponent} from "./loading-indicator.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
  declarations: [LoadingIndicatorComponent],
  imports: [MatProgressSpinnerModule],
  exports: [LoadingIndicatorComponent]
})
export class LoadingIndicatorModule { }
