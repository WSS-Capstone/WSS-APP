import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  signup: FormGroup;
  hide = true;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private readonly _router: Router
  ) {
    this.signup = fb.group({
      fullname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(1)]],
      gender: [null, [Validators.required]],

      rememberMe: [true],
    });

  }

  ngOnInit(): void {
  }

  getControlInvalid(control: string): boolean {
    return this.signup.controls[control]?.invalid;
  }

  onSubmit(): void {
    if (this.signup.invalid || this.isLoading) {
      return;
    }
    console.log(this.signup.value);
    // this.isLoading = true;
    // this.loginStore.doLogin(this.loginForm.value);
  }


  goToLogin(): void {
    this._router.navigate(['/login']);
  }
}
