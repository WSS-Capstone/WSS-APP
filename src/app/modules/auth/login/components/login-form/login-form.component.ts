import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoginStore } from '../../store/login.store';
import { GoogleAuthProvider } from 'firebase/auth';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm: FormGroup;
  hide = true;
  isLoading = false;
  // isDisabled$ = this.loginStore.isDisableButton$;
  error$ = this.loginStore.error$;

  constructor(
    private fb: FormBuilder,
    private readonly _router: Router,
    private auth: AngularFireAuth,
    private loginStore: LoginStore,
  ) {
    this.loginForm = fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(1)]],
      rememberMe: [true],
    });
  }

  getControlInvalid(control: string): boolean {
    return this.loginForm.controls[control]?.invalid;
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      // markFormGroupTouched(this.loginForm);
      return;
    }
    this.loginStore.doLogin(this.loginForm.value);
  }

  onRegister(): void {
    this._router.navigate(['/sign-up']);
  }

  loginWithGoogle(): void {
    this.auth.signInWithPopup(new GoogleAuthProvider()).then((res) => {
      console.log(res);
    });
  }
}
