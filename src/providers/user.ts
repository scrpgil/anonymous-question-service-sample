import { getUser } from '../helpers/firebase';
import { IUser } from '../interfaces/user';

export class UserController {
  constructor() {}

  async getUser(userId: string): Promise<IUser> {
    return new Promise(async resolve => {
      const doc = await getUser(userId);
      const user: IUser | any = doc.data();
      user.id = doc.id;
      resolve(user);
    });
  }
}

export const UserProvider = new UserController();
