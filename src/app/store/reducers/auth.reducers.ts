import {AuthState} from "../../core/models/auth/auth-state";
import {createReducer, on} from "@ngrx/store";
import * as AuthActions from 'src/app/store/actions/auth.actions';

export const initialAuthState: AuthState = {
  isAuthenticated: null,
  user: null,
  error: null,
  token: null,
  isRememberMe: null,
};

export const authReducers = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => ({
    ...state,
    isRememberMe: action.data.isRememberMe,
  })),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    isAuthenticated: true,
    user: action.user,
    error: null,
    token: action.token,
  })),
  on(AuthActions.loginFailure, (state, action) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    error: action.error,
  })),
  on(AuthActions.logoutSuccess, (state, action) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    error: null,
    token: null,
  })),
  on(AuthActions.renewTokenSuccess, (state, action) => ({
    ...state,
    isAuthenticated: true,
    token: action.token,
    isRememberMe: action.isRememberMe ?? state.isRememberMe,
  })),
  on(AuthActions.renewTokenFailure, (state, action) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    error: action.error,
    token: null,
  })),
  on(AuthActions.deleteLoginError, (state, action) => ({
    ...state,
    isAuthenticated: null,
    user: null,
    error: null,
    token: null,
  }))
);
