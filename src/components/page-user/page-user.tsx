import { h, Component, Element, State, Prop } from '@stencil/core';
import { UserProvider } from '../../providers/user';
import { MessageProvider } from '../../providers/message';
import { loadingController } from '@ionic/core';
import { IMessage, initMessage } from '../../interfaces/message';
import { IUser } from '../../interfaces/user';

@Component({
  tag: 'page-user',
  styleUrl: 'page-user.scss',
})
export class UserPage {
  @State() user: IUser = null;
  @State() text: string = '';
  @State() sended: boolean = false;
  @Prop() userId: string = '';
  @Element() el: HTMLElement;

  textInput(el) {
    this.text = el.srcElement.value;
  }

  componentWillLoad() {
    this.getUser();
  }

  async getUser() {
    this.user = await UserProvider.getUser(this.userId);
  }

  async send(ev) {
    if (ev && ev.detail) {
      const loading = await loadingController.create({
        message: '送信中',
        duration: 20000,
      });
      await loading.present();
      const message: IMessage = initMessage();
      message.body = ev.detail;
      const res = await MessageProvider.create(this.userId, message);
      await loading.dismiss();
      (this.el.closest('ion-nav') as any).push('page-message', {
        userId: this.userId,
        messageId: res.id,
      });
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button default-href="/users" text="戻る" />
          </ion-buttons>
          <ion-title>ユーザー詳細</ion-title>
          <ion-buttons slot="end">
            <auth-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content class="ion-padding">
        {(() => {
          if (this.user) {
            return <user-profile image={this.user.icon} name={this.user.name} />;
          }
        })()}
        <app-textarea placeholder="気になることを聞いてみよう" btText="送信する" onClicked={ev => this.send(ev)} />
      </ion-content>,
    ];
  }
}
