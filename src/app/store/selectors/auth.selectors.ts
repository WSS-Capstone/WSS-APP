import { createFeatureSelector, createSelector } from '@ngrx/store';
import {AuthState} from "../../core/models/auth/auth-state";

export const AUTH_STATE_NAME = 'auth';

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_STATE_NAME);

export const isAuthenticated$ = createSelector(selectAuthState, (state) => state.isAuthenticated);

export const user$ = createSelector(selectAuthState, (state) => state.user);

export const token$ = createSelector(selectAuthState, (state) => state.token);

export const authError$ = createSelector(selectAuthState, (state) => state.error);

export const rememberMe$ = createSelector(selectAuthState, (state) => state.isRememberMe);

export const deleteLoginError$ = createSelector(selectAuthState, (state) => state);
