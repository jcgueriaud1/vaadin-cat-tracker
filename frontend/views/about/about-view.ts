import { LitElement, html, css, customElement } from 'lit-element';

@customElement('about-view')
export class AboutView extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--lumo-space-m) var(--lumo-space-l);
      }
    `;
  }

  render() {
    return html`
        <h1>Cat detector</h1>
        <p>This application uses the camera of your laptop or phone and detector if there is a person, cat or dog.<br/>
        If it detects one of this element, it will play a sound and enable the right button.<br/>
        It's using Tensor flow to detect the "object". You can check this <a href=" https://codelabs.developers.google.com/codelabs/tensorflowjs-object-detection/index.html?index=..%2F..index#0" target="_blank">tutorial</a> if you want to see more.
        </p>
      <br />
      Sound from <a href="https://www.Zapsplat.com" target="_blank">Zapsplat.com</a>
    `;
  }
}
