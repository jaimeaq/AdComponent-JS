export class AdComponent extends HTMLElement {
  constructor() {
        super();
        this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    const width = this.getAttribute('width').trim() || 0;
    const height = this.getAttribute('height').trim() || 0;

    if (width <= 0 || height <= 0) {
      console.error('Error: AdComponent requires both width and height.');
      return;
    }

    // Loading state
    this.shadowRoot.innerHTML = `
        <style>
            img {
                max-width: 100%;
                display: block;
            }
            .loading {
                width: ${width}px;
                height: ${height}px;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        </style>
        <div class="loading">Loading...</div>
    `;

    const img = document.createElement('img');
    img.alt = "Random image";

    img.addEventListener('load', () => {
      this.shadowRoot.innerHTML = `
        <style>
            img {
                max-width: 100%;
                display: block;
            }
        </style>
      `;
      this.shadowRoot.appendChild(img);
    });

    img.addEventListener('error', () => {
      console.error('Error: Failed to load image.');
      this.shadowRoot.innerHTML = `
        <style>
            .error {
                width: ${width}px;
                height: ${height}px;
                background-color: #ffdddd;
                color: #ff0000;
                display: flex;
                align-items: center;
                justify-content: center;
            }        
        </style>
        <div class="error">Image failed to laod</div>
      `;
    });

    img.src = `https://picsum.photos/${width}/${height}`;
  }
}
