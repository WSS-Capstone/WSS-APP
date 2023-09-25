export interface IUser {
  email?: string;
  phone?: string;
  fullname?: string;
  roleName?: string;
  isActive?: boolean;
}

export interface IToken {
  idToken: string;
}
