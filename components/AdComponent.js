export class AdComponent extends HTMLElement {
  constructor() {
        super();
        this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    const width = this.getAttribute('width') ? this.getAttribute('width') : 0;
    const height = this.getAttribute('height') ? this.getAttribute('height') : 0;
    const location = this.getAttribute('location') ? this.getAttribute('location') : 'unknown';

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
          this.trackImpression(imageUrl, width, height, location);
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

  trackImpression(imageUrl, width, height, location) {
    const impressionEvent = {
      eventType: 'impression',
      timeStamp: new Date().toISOString(),
      adData: {
        url: imageUrl,
        width: width,
        height: height,
        location: location
      },
      pageInfo: {
        url: window.location.href,
        referrer: document.referrer || null
      }
    };

    fetch('http://localhost:8080/api/analytics/impression', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(impressionEvent)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Analytics error! Status: ${response.status}`);
      }
      console.log('Impression tracked successfully');
    })
    .catch(error => {
      console.warn('Failed to track impression:', error);
    });
  }
}
