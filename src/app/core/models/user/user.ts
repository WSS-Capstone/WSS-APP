export interface IUser {
  username: string;
  displayName: string;
  localId: string;
  kind: string;
}

export interface IToken {
  idToken: string;
  expiresIn: number;
}


export class Token implements IToken {
  expiresIn: number;
  idToken: string;

  constructor() {
    this.expiresIn = null;
    this.idToken = null;
  }
}
