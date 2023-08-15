import {IToken, IUser} from "../user/user";

export interface AuthState {
  isAuthenticated: boolean;
  user: IUser;
  error: string;
  token: IToken;
  isRememberMe: boolean;
}
