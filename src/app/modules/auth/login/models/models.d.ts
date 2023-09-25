export interface ILoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ILoginState {
  isFormValid: boolean;
  error: string;
  isDisableButton: boolean;
  loginValue: ILoginForm;
}

export interface LoginInfo {
  email: string;
  phone: string;
  fullname: string;
  gender: any;
  address: string;
  roleName: string;
  isActive: boolean;
}
