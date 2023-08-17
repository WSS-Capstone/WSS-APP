import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class AppInitializer {


  constructor() {
      console.log('AppInitializer');
  }

  auth(): Observable<any> {
      console.log('AppInitializer auth');
      return null;
  }
}

export function initializeTokenFactory(appInitializer: AppInitializer): () => Observable<string> {
  return () => appInitializer.auth();
}
