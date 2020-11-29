export interface IMessage {
  id?: string; // ID
  body: string; // 質問文
  answer: string; // 回答文
  createdAt: Date; // 作成日
  updatedAt: Date; // 更新日
}

export const initMessage = () => {
  const message: IMessage = {
    body: '',
    answer: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return message;
};
