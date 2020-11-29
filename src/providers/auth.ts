import { authenticateGoogle, isAuth } from "../helpers/firebase";

export class AuthController {
  public loginUser: any = null;
  constructor() {}

  async login() {
    authenticateGoogle();
  }

  async loggedIn() {
    if (this.loginUser) {
      return this.loginUser;
    } else {
      this.loginUser = await isAuth();
      return this.loginUser;
    }
  }
}

export const AuthProvider = new AuthController();