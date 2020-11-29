import { authenticateGoogle, isAuth, signOut, updateUserName } from '../helpers/firebase';

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

  async logout(): Promise<void> {
    this.loginUser = null;
    await signOut();
    location.href = '/';
  }

  async updateName(userId: string, name: string) {
    await updateUserName(userId, name);
    this.loginUser.displayName = name;
  }
}

export const AuthProvider = new AuthController();
