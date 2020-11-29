import { h, Component, State } from '@stencil/core';
import { MessageProvider } from '../../providers/message';
import { AuthProvider } from '../../providers/auth';
import { IMessage } from '../../interfaces/message';
import { formatDate } from '../../helpers/firebase';

@Component({
  tag: 'page-messages',
  styleUrl: 'page-messages.scss',
})
export class MessagesPage {
  @State() loginUser: any = null;
  @State() messages: IMessage[] = [];

  componentWillLoad() {
    this.loggedIn();
  }

  async loggedIn() {
    this.loginUser = await AuthProvider.loggedIn();
    this.getList();
  }

  async getList(createdAt: Date = new Date()) {
    const res = await MessageProvider.getMessageList(this.loginUser.uid, createdAt);
    if (res) {
      if (createdAt) {
        this.messages = this.messages.concat(res);
      } else {
        this.messages = res;
      }
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>メッセージ一覧</ion-title>
          <ion-buttons slot="end">
            <auth-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <ion-content class="ion-padding">
        {(() => {
          if (this.loginUser) {
            return (
              <div class="c-messages">
                {(() => {
                  if (this.loginUser && this.messages.length > 0) {
                    let list = [];
                    for (const message of this.messages) {
                      list.push(
                        <div class="c-messages__item">
                          <div class="c-messages__item-created">{formatDate(message.createdAt)}</div>
                          <div class="c-messages__item-message">{message.body}</div>
                          <div class="c-messages__item-button">
                            <ion-button fill="clear" size="small" color={message.answer ? 'medium' : 'primary'} href={'messages/' + this.loginUser.uid + '/' + message.id}>
                              <ion-icon slot="start" name="chatbubbles" />
                              {message.answer ? '回答済み' : '回答する'}
                            </ion-button>
                          </div>
                        </div>,
                      );
                    }
                    return list;
                  } else {
                    return <div class="empty text-medium">まだ質問がありません</div>;
                  }
                })()}
              </div>
            );
          }
        })()}
      </ion-content>,
    ];
  }
}