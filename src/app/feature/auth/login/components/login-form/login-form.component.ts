import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  constructor(private fb: FormBuilder) {
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

    this.isLoading = true;
    // this.loginStore.doLogin(this.loginForm.value);
  }
}
