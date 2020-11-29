import { h, Component, Prop, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'app-textarea',
  styleUrl: 'app-textarea.scss',
})
export class AppTextarea {
  @Prop() placeholder: string = '';
  @Prop() btText: string = '';

  @State() text: string = '';
  @State() validate: boolean = true;

  @Event() clicked: EventEmitter;

  textInput(el) {
    this.text = el.srcElement.value;
    if (0 <= this.text.length && this.text.length <= 140) {
      this.validate = false;
    } else {
      this.validate = true;
    }
  }

  async send() {
    this.clicked.emit(this.text);
  }

  render() {
    return (
      <div class="c-textarea">
        <textarea id="textarea" placeholder={this.placeholder} onInput={e => this.textInput(e)} />
        <div class="c-textarea__number"> {this.text.length}/140 </div>
        <ion-button class="c-textarea__button" disabled={this.validate} onClick={() => this.send()}>
          <ion-icon slot="start" name="send" />
          {this.btText}
        </ion-button>
      </div>
    );
  }
}
