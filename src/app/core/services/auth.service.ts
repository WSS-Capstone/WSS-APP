import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    constructor(
      private auth: AngularFireAuth
    ) {
    }

    login(username: string, password: string) {
      return this.auth.signInWithEmailAndPassword(username, password);
    }

    loginWithGoogle() {
      // return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    logout() {
      return this.auth.signOut();
    }

}
