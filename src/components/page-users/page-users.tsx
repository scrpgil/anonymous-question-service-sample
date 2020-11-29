import { h, Component, State, Prop } from '@stencil/core';
import { UserProvider } from '../../providers/user';

@Component({
  tag: 'page-users',
  styleUrl: 'page-users.scss',
})
export class UsersPage {
  @State() users: any = [];
  @Prop() userId: string = '';

  componentWillLoad() {
    this.getUserList();
  }

  async getUserList(createdAt: Date = new Date()) {
    const res = await UserProvider.getUserList(createdAt);
    if (res) {
      if (createdAt) {
        this.users = this.users.concat(res);
      } else {
        this.users = res;
      }
    }
  }

  async doRefresh(ev: any) {
    this.users = [];
    await this.getUserList();
    ev.target.complete();
  }
  async loadData(ev) {
    if (this.users.length > 0) {
      if (this.users.length > 1) {
        const createdAt = this.users[this.users.length - 1].createdAt;
        await this.getUserList(createdAt);
      } else {
        await this.getUserList();
      }
    }
    ev.target.complete();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>ユーザー一覧</ion-title>
          <ion-buttons slot="end">
            <auth-button />
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-refresher slot="fixed" onIonRefresh={ev => this.doRefresh(ev)}>
          <ion-refresher-content />
        </ion-refresher>
        <ion-list>
          <ion-list-header>
            <ion-label class="text-medium">新着ユーザー</ion-label>
          </ion-list-header>
          {(() => {
            if (this.users.length > 0) {
              let list = [];
              for (const user of this.users) {
                list.push(
                  <ion-item href={'users/' + user.id} lines="full">
                    <ion-avatar slot="start">
                      <img src={user.icon} />
                    </ion-avatar>
                    <ion-label>{user.name}</ion-label>
                  </ion-item>,
                );
              }
              return list;
            }
          })()}
        </ion-list>
        <ion-infinite-scroll id="infinite-scroll" onIonInfinite={ev => this.loadData(ev)}>
          <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="読み込み中..." />
        </ion-infinite-scroll>
      </ion-content>,
    ];
  }
}