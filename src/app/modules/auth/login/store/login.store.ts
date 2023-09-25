import {ILoginForm, ILoginState} from "../models/models";
import {ImmerComponentStore} from "ngrx-immer/component-store";
import {Injectable} from "@angular/core";
import {AuthState} from "../../../../core/models/auth/auth-state";
import {Store} from "@ngrx/store";
import {LoginRequest} from "../../../../core/models/auth/login-request";
import {login} from "../../../../store/actions/auth.actions";
import {authError$} from "../../../../store/selectors/auth.selectors";

const initLoginState: ILoginState = {
  isDisableButton: false,
  error: null,
  isFormValid: true,
  loginValue: null,
};

@Injectable()
export class LoginStore extends ImmerComponentStore<ILoginState>{
readonly isFormValid$ = this.select(({isFormValid}) => isFormValid);
  readonly error$ = this.select(({error}) => error);
  readonly isDisableButton$ = this.select(({isDisableButton}) => isDisableButton);
  readonly loginValue$ = this.select(({loginValue}) => loginValue);

  readonly addFormValue = this.updater((state, formValue: ILoginForm) => {
    state.loginValue = formValue;
  });

  readonly showError = this.updater((state, error: string) => {
    state.error = error;
  });

  readonly updateDisableButtonStatus = this.updater((state, isDisabled: boolean) => {
    state.isDisableButton = isDisabled;
  });

  constructor(private store: Store<AuthState>) {
    super({ ...initLoginState });
  }

  readonly doLogin = (formValue: ILoginForm) =>{
    this.addFormValue(formValue);
    const loginRequest = new LoginRequest(formValue.email, formValue.password, formValue.rememberMe);
    this.store.dispatch(login({ data: loginRequest }));

    this.store.select(authError$).subscribe({
      next: (error) => {
        this.showError(error);
      },
    });
  }

}
