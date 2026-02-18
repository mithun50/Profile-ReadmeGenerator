function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (type ? ` ${type}` : '');
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

function bindEvents() {
  // Auth buttons
  document.getElementById('login-btn').addEventListener('click', () => auth.login());
  document.getElementById('hero-login-btn').addEventListener('click', () => auth.login());
  document.getElementById('logout-btn').addEventListener('click', () => auth.logout());

  // Chat
  document.getElementById('send-btn').addEventListener('click', () => chatUI.send());
  document.getElementById('reset-btn').addEventListener('click', () => chatUI.reset());
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatUI.send();
    }
  });

  // Preview tabs & actions
  document.getElementById('tab-preview').addEventListener('click', () => preview.showTab('preview'));
  document.getElementById('tab-raw').addEventListener('click', () => preview.showTab('raw'));
  document.getElementById('copy-btn').addEventListener('click', () => preview.copy());
  document.getElementById('download-btn').addEventListener('click', () => preview.download());
  document.getElementById('validate-btn').addEventListener('click', () => preview.validate());
  document.getElementById('deploy-btn').addEventListener('click', () => preview.deploy());

  // Modal
  document.getElementById('modal-cancel').addEventListener('click', () => preview.closeModal());
  document.getElementById('modal-confirm').addEventListener('click', () => preview.confirmDeploy());
}

async function init() {
  bindEvents();
  chatUI.init();
  const loggedIn = await auth.checkStatus();
  if (loggedIn) {
    await chatUI.loadTemplates();
    await chatUI.loadHistory();
  }

  // Check for OAuth error in URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('error')) {
    showToast('Login failed: ' + params.get('error'), 'error');
    window.history.replaceState({}, '', '/');
  }
}

init();
