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
  id: string;
  username: string;
  status: string;
  refId: string;
  roleName: string;
  owner?: UserInfo;
  customer?: UserInfo;
  partner?: UserInfo;
}

export interface UserInfo {
  id: string;
  fullname: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  imageUrl: string;
  gender: string;
}
