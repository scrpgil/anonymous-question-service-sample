import { h, Component, State } from "@stencil/core";
import { AuthProvider } from "../../../providers/auth";

@Component({
  tag: "auth-button",
  styleUrl: "auth-button.scss",
})
export class AuthButtonComponent {
  @State() loginUser: any = null;
  @State() fetched: boolean = false;

  componentWillLoad() {
    this.loggedIn();
  }

  async login() {
    AuthProvider.login();
  }

  async loggedIn() {
    this.loginUser = await AuthProvider.loggedIn();
    this.fetched = true;
  }

  render() {
    return (
      <div>
        {(() => {
          if (this.fetched) {
            if (this.loginUser) {
              return [
                <ion-button class="c-auth-button">
                  <img src={this.loginUser.providerData[0].photoURL} />
                </ion-button>,
              ];
            } else {
              return [
                <ion-button onClick={() => this.login()}>ログイン</ion-button>,
              ];
            }
          }
        })()}
      </div>
    );
  }
}