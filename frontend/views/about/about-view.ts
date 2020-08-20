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
      <br />
      Sound from <a href="">Zapsplat.com</a>
    `;
  }
}
