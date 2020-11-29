import { h, Component, State, Prop } from '@stencil/core';
import { loadingController, toastController } from '@ionic/core';
import { MessageProvider } from '../../providers/message';
import { AuthProvider } from '../../providers/auth';
import { UserProvider } from '../../providers/user';
import { IUser } from '../../interfaces/user';
import { IMessage } from '../../interfaces/message';
import { getTwitterLink } from '../../helpers/utils';

@Component({
  tag: 'page-message',
  styleUrl: 'page-message.scss',
})
export class MessagePage {
  @State() loginUser: any = null;
  @State() user: IUser = null;
  @State() message: IMessage;
  @State() text: string = '';
  @State() twitterLink: string = '#';

  @Prop() userId: string;
  @Prop() messageId: string;

  componentWillLoad() {
    this.loggedIn();
  }

  componentDidLoad() {
    this.getMessage();
    this.getUser();
  }

  async loggedIn() {
    this.loginUser = await AuthProvider.loggedIn();
  }
  async send(ev) {
    if (ev && ev.detail) {
      const loading = await loadingController.create({
        message: '送信中',
        duration: 20000,
      });
      await loading.present();
      this.message.answer = ev.detail;
      await MessageProvider.updateMessage(this.userId, this.messageId, this.message);
      await loading.dismiss();
      const toast = await toastController.create({
        message: '送信が完了しました',
        position: 'top',
        duration: 2000,
      });
      toast.present();
    }
  }

  async getUser() {
    this.user = await UserProvider.getUser(this.userId);
  }

  async getMessage() {
    this.message = await MessageProvider.get(this.userId, this.messageId);
    if (this.message && this.message.answer) {
      this.text = this.message.answer;
      this.twitterLink = getTwitterLink('/messages/' + this.userId + '/' + this.messageId);
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button text="戻る" default-href="messages" />
          </ion-buttons>
          <ion-title>メッセージ詳細</ion-title>
          <ion-buttons slot="end">
            <auth-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        {(() => {
          if (this.message) {
            return (
              <div class="p-message">
                <div class="p-message__message">
                  <img src="/assets/imgs/base.png" />
                  <div class="p-message__message-body">{this.message.body}</div>
                </div>
                <div class="p-message__answer">
                  <div class="p-message__answer-user">
                    <user-profile image={this.user.icon} name="" size={50} message="" />
                    <div class="p-message__answer-user-name">{this.user.name}</div>
                  </div>
                  <div class="p-message__answer-message">{this.message.answer ? this.message.answer : 'まだ回答はありません'}</div>
                  {(() => {
                    if (this.message.answer) {
                      return (
                        <div class="p-message__answer-twitter">
                          <ion-button size="small" fill="clear" href={this.twitterLink} target="_blank">
                            <ion-icon slot="start" name="logo-twitter" />
                            Twitterにも投稿する
                          </ion-button>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.message && this.loginUser && this.user && this.loginUser.uid == this.userId) {
            return <app-textarea placeholder="回答を書こう" btText="回答する" onClicked={ev => this.send(ev)} />;
          }
        })()}
      </ion-content>,
    ];
  }
}
