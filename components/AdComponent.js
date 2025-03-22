export class AdComponent extends HTMLElement {
  constructor() {
        super();
        this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
          AdComponent
    `;
  }
}
