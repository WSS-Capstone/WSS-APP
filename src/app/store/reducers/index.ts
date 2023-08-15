import {ActionReducerMap, MetaReducer} from "@ngrx/store";
import {AUTH_STATE_NAME} from "../selectors/auth.selectors";
import {AuthState} from "../../core/models/auth/auth-state";
import {authReducers} from "./auth.reducers";

export interface AppState {
  // weddingServiceState: OfficeManagementState;
  [AUTH_STATE_NAME]: AuthState;
  // [UI_CONFIG_NAME]: UiConfigState;
}

export const reducers: ActionReducerMap<AppState> = {
  // officeManagementState: officeManagementReducer,
  [AUTH_STATE_NAME]: authReducers,
  // [UI_CONFIG_NAME]: UiConfigReducers,
};

export const metaReducers: MetaReducer<AppState>[] = [];

