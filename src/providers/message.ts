import { IMessage } from '../interfaces/message';
import { addMessage, getMessage, getMessages, putMessage } from '../helpers/firebase';

export class MessageController {
  constructor() {}

  async create(userId: string, message: IMessage) {
    const res = addMessage(userId, message);
    return res;
  }

  async getMessageList(userId: string, createdAt: Date = new Date()): Promise<IMessage[]> {
    return new Promise(async resolve => {
      const messageList: IMessage[] = [];
      getMessages(userId, createdAt).then((snapshot: any) => {
        snapshot.forEach((doc: any) => {
          const message = doc.data();
          message.id = doc.id;
          messageList.push(message);
        });
        resolve(messageList);
      });
    });
  }

  async get(userId: string, messageId: string): Promise<IMessage> {
    return new Promise(async resolve => {
      const doc = await getMessage(userId, messageId);
      const message: any = doc.data();
      message.id = doc.id;
      resolve(message);
    });
  }
  async updateMessage(userId: string, messageId: string, message: IMessage) {
    const res = await putMessage(userId, messageId, message);
    return res;
  }
}

export const MessageProvider = new MessageController();
