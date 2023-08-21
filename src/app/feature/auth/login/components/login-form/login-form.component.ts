import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {from} from "rxjs";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  hide = true;
  isLoading = false;
  // isDisabled$ = this.loginStore.isDisableButton$;
  // error$ = null;

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth
  ) {
    this.loginForm = fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(1)]],
      rememberMe: [true],
    });
  }

  getControlInvalid(control: string): boolean {
    return this.loginForm.controls[control]?.invalid;
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }
    let value = from(this.auth.signInWithEmailAndPassword(this.loginForm.value.username, this.loginForm.value.password));

    value.subscribe(e => {
      console.log(e);
      e.user?.getIdToken().then(token => {
        console.log(token);
        localStorage.setItem('token', token);
      });
    })

    console.log(this.loginForm.value);
    // this.isLoading = true;
    // this.loginStore.doLogin(this.loginForm.value);
  }
}
