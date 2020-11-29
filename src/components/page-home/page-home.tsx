import { Component, h, State } from '@stencil/core';
import { AuthProvider } from '../../providers/auth';
import { loadingController, toastController } from '@ionic/core';
import { MessageProvider } from '../../providers/message';
import { IMessage, initMessage } from '../../interfaces/message';

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.scss',
})
export class PageHome {
  @State() loginUser: any = null;

  componentWillLoad() {
    this.loggedIn();
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
      const message: IMessage = initMessage();
      message.body = ev.detail;
      await MessageProvider.create(this.loginUser.uid, message);
      await loading.dismiss();
      const toast = await toastController.create({
        message: '送信が完了しました',
        position: 'top',
        duration: 2000,
      });
      toast.present();
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>ホーム</ion-title>
          <ion-buttons slot="end">
            <auth-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        {(() => {
          if (this.loginUser) {
            return (
              <div class="ion-padding">
                <user-profile image={this.loginUser.providerData[0].photoURL} name={this.loginUser.displayName} />
                <app-textarea placeholder="気になることを聞いてみよう" btText="送信する" onClicked={ev => this.send(ev)} />
              </div>
            );
          }
        })()}
      </ion-content>,
    ];
  }
}
