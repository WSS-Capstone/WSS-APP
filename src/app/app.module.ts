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
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {provideFirebaseApp} from "@angular/fire/app";
import firebase from "firebase/compat/app";
import initializeApp = firebase.initializeApp;
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {getFirestore, provideFirestore} from "@angular/fire/firestore";
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {SharedModule} from "./shared/shared.module";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./store/effects/auth.effects";
import {MatDialogModule} from "@angular/material/dialog";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";

const initFirebase = [
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireAuthModule,
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAnalytics(() => getAnalytics()),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  provideFunctions(() => getFunctions()),
]

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
    MatDialogModule,
    CoreModule,
    SharedModule,
    StoreModule.forRoot(reducers, {metaReducers}),
      EffectsModule.forRoot([AuthEffects]),
    ...initFirebase
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
