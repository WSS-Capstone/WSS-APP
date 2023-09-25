export class LoginRequest {
  email: string;
  password: string;
  isRememberMe: boolean;
  /**
   *
   */
  constructor(email: string, password: string, isRememberMe: boolean) {
    this.email = email;
    this.password = password;
    this.isRememberMe = isRememberMe;
  }
}
