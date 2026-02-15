// View Counter - Client-side
// Add to your base layout before </body>

class ViewCounter {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.path = window.location.pathname;
    this.storageKey = `viewed_${this.path}`;
  }

  async init() {
    if (this.hasViewed()) return;
    await this.increment();
    this.markViewed();
  }

  hasViewed() {
    return sessionStorage.getItem(this.storageKey) === 'true';
  }

  markViewed() {
    sessionStorage.setItem(this.storageKey, 'true');
  }

  async increment() {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        mode: 'cors',
      });
    } catch (e) {
      console.log('View counter unavailable');
    }
  }

  async getViews() {
    try {
      const res = await fetch(`${this.apiUrl}/${this.path}`);
      const data = await res.json();
      return data.views;
    } catch (e) {
      return null;
    }
  }
}

// Usage:
// <script>
//   const counter = new ViewCounter('https://your-worker.workers.dev');
//   counter.init().then(() => {
//     counter.getViews().then(views => {
//       if (views) document.getElementById('viewCount').textContent = views;
//     });
//   });
// </script>
