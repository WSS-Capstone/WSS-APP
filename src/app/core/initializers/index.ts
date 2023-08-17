import {APP_INITIALIZER} from "@angular/core";
import {AppInitializer, initializeTokenFactory} from "./app.initializer";

export const appInitializers = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeTokenFactory,
    deps: [AppInitializer],
    multi: true,
  },
];
