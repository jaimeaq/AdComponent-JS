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

    fetch(`http://localhost:8080/ads/${width}/${height}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const imageUrl = data.url;

        const img = document.createElement('img');
        img.alt = "Advertisement";

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
            <div class="error">Image failed to load</div>
          `;
        });

        img.src = imageUrl;
      })
      .catch(error => {
        console.error('Error fetching ad:', error);
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
          <div class="error">Failed to fetch advertisement</div>
        `;
      });
  }
}
