import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {LoadingIndicatorModule} from "./shared/components/loading-indicator/loading-indicator.module";
import {metaReducers, reducers} from "./store/reducers";
import {StoreModule} from "@ngrx/store";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ConfigData} from "./core/models/config-data";
import {AppInitializer} from "./core/initializers/app.initializer";
import {CoreModule} from "./core/core.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    LoadingIndicatorModule,
    CoreModule,
    StoreModule.forRoot(reducers, {metaReducers}),
  ],
  providers: [
    ConfigData,
    AppInitializer
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
