export class LoginRequest {
  email: string;
  password: string;
  returnSecureToken: boolean;
  opaqueId: number;
  isRememberMe: boolean;
  /**
   *
   */
  constructor(email: string, password: string, opaqueId: number, isRememberMe: boolean) {
    this.email = email;
    this.password = password;
    this.returnSecureToken = true;
    this.opaqueId = opaqueId;
    this.isRememberMe = isRememberMe;
  }
}
