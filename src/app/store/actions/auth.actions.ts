import { createAction, props, union } from '@ngrx/store';
import {IToken, IUser} from "../../core/models/user/user";
import {LoginRequest} from "../../core/models/auth/login-request";

export const login = createAction('[Auth] Login Firebase', props<{ data: LoginRequest }>());

export const loginSuccess = createAction('[Auth] Login Success', props<{ user: IUser; token: IToken }>());

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const setUserInfo = createAction('[Auth] Set User Info', props<{ user: IUser }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const deleteLoginError = createAction('[Auth] delete notification login fail');

export const renewToken = createAction('[Auth] Exchange for ID Token');

export const renewTokenSuccess = createAction(
  '[Auth] Exchange for ID Token or update token to store Success',
  props<{ token: IToken; isRememberMe?: boolean }>()
);

export const renewTokenFailure = createAction('[Auth] Exchange for ID Token Failure', props<{ error: string }>());

const AUTH_ACTIONS = union({
  login,
  loginSuccess,
  loginFailure,
  setUserInfo,
  logout,
  renewToken,
  renewTokenSuccess,
  renewTokenFailure,
  deleteLoginError,
});

export type AuthActions = typeof AUTH_ACTIONS;
