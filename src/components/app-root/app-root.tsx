import { Component, h, State } from '@stencil/core';
import { AuthProvider } from '../../providers/auth';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {
  @State() loginUser: any = null;

  constructor() {
    this.loggedIn();
  }

  async loggedIn() {
    this.loginUser = await AuthProvider.loggedIn();
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false}>
          {(() => {
            if (this.loginUser) {
              return [
                <ion-route-redirect from="/" to="home" />,
                <ion-route component="page-tabs">
                  <ion-route url="/home" component="tab-home">
                    <ion-route component="page-home" />
                  </ion-route>
                  <ion-route url="/messages" component="tab-message">
                    <ion-route component="page-messages" />
                    <ion-route url="/:userId/:messageId" component="page-message" />
                  </ion-route>
                  <ion-route url="/users" component="tab-user">
                    <ion-route component="page-users" />
                    <ion-route url="/:userId" component="page-user" />
                  </ion-route>
                  <ion-route url="/setting" component="tab-setting">
                    <ion-route component="page-setting" />
                  </ion-route>
                </ion-route>,
              ];
            } else {
              return [
                <ion-route-redirect from="/" to="users" />,
                <ion-route url="/users" component="page-users" />,
                <ion-route url="/users/:userId" component="page-user" />,
                <ion-route url="/messages/:userId/:messageId" component="page-message" />,
              ];
            }
          })()}
        </ion-router>
        <ion-nav />
      </ion-app>
    );
  }
}
