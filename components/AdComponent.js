export class AdComponent extends HTMLElement {
  constructor() {
        super();
        this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    const width = this.getAttribute('data-width').trim();
    const height = this.getAttribute('data-height').trim();

    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="/components/AdComponent.css">
        
        <img src="https://picsum.photos/${width}/${height}" alt="Test img"> 
    `;
  }
}
