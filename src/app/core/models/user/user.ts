export interface IUser {
  id?: string;
  email?: string;
  phone?: string;
  fullname?: string;
  roleName?: string;
  isActive?: boolean;
}

export interface IToken {
  idToken: string;
}
