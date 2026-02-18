const api = {
  csrfToken: null,

  async fetchCsrfToken() {
    const res = await fetch('/api/csrf-token', { credentials: 'include' });
    const data = await res.json();
    this.csrfToken = data.token;
  },

  async get(url) {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
  },

  async post(url, data) {
    if (!this.csrfToken) {
      await this.fetchCsrfToken();
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    // If CSRF token expired, refresh and retry once
    if (res.status === 403) {
      await this.fetchCsrfToken();
      const retry = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrfToken
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!retry.ok) {
        const body = await retry.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${retry.status}`);
      }
      return retry.json();
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
  }
};
