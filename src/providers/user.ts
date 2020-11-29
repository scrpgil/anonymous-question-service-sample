import { getUser, getUsers } from '../helpers/firebase';
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

  async getUserList(createdAt: Date = new Date()): Promise<IUser[]> {
    return new Promise(async resolve => {
      const userList: IUser[] = [];
      getUsers(createdAt).then((snapshot: any) => {
        snapshot.forEach((doc: any) => {
          const user = doc.data();
          user.id = doc.id;
          userList.push(user);
        });
        resolve(userList);
      });
    });
  }
}

export const UserProvider = new UserController();
