import { h, Component, State } from '@stencil/core';
import { AuthProvider } from '../../providers/auth';
import { toastController } from '@ionic/core';

@Component({
  tag: 'page-setting',
  styleUrl: 'page-setting.scss',
})
export class SettingPage {
  @State() loginUser: any = null;
  @State() disabled: boolean = false;
  textInput!: HTMLInputElement;

  componentWillLoad() {
    this.loggedIn();
  }

  async loggedIn() {
    this.loginUser = await AuthProvider.loggedIn();
  }

  async save() {
    this.disabled = true;
    await AuthProvider.updateName(this.loginUser.uid, this.textInput.value);
    const toast = await toastController.create({
      message: '変更が完了しました',
      position: 'top',
      duration: 2000,
    });
    toast.present();
    this.disabled = false;
  }

  async logout() {
    AuthProvider.logout();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>設定</ion-title>
          <ion-buttons slot="end">
            <auth-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        {(() => {
          if (this.loginUser) {
            return (
              <div class="p-setting">
                <div class="p-setting__title">設定</div>
                <div class="p-setting__form">
                  <div class="p-setting__form-label">表示名</div>
                  <div class="p-setting__form-input">
                    <ion-input value={this.loginUser.displayName} ref={(el: any) => (this.textInput = el as HTMLInputElement)} />
                  </div>
                  <div class="p-setting__save">
                    <ion-button disabled={this.disabled} onClick={() => this.save()}>
                      <ion-icon slot="start" name="send" />
                      {this.disabled ? '保存中' : '保存する'}
                    </ion-button>
                  </div>
                </div>
                <div class="p-setting__logout">
                  <ion-button color="medium" size="small" fill="clear" onClick={() => this.logout()}>
                    ログアウトする
                  </ion-button>
                </div>
              </div>
            );
          }
        })()}
      </ion-content>,
    ];
  }
}

