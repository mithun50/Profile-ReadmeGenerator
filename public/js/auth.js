const auth = {
  user: null,

  login() {
    window.location.href = '/auth/github';
  },

  logout() {
    window.location.href = '/auth/logout';
  },

  async checkStatus() {
    try {
      const data = await api.get('/auth/status');
      if (data.authenticated) {
        this.user = data.user;
        this.showLoggedIn();
        return true;
      }
    } catch (e) {
      console.error('Auth check failed:', e);
    }
    this.showLoggedOut();
    return false;
  },

  showLoggedIn() {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-avatar').src = this.user.avatar_url;
    document.getElementById('user-name').textContent = this.user.name || this.user.login;
    document.getElementById('landing').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  },

  showLoggedOut() {
    document.getElementById('login-btn').style.display = 'inline-flex';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('landing').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }
};
