const preview = {
  currentReadme: null,
  activeTab: 'preview',

  show(markdown) {
    this.currentReadme = markdown;
    document.getElementById('preview-panel').style.display = 'flex';
    this.renderPreview(markdown);
    this.showTab('preview');
  },

  hide() {
    this.currentReadme = null;
    document.getElementById('preview-panel').style.display = 'none';
    document.getElementById('preview-rendered').innerHTML = '';
    document.getElementById('preview-raw').textContent = '';
  },

  async renderPreview(markdown) {
    try {
      const data = await api.post('/api/readme/preview', { markdown });
      document.getElementById('preview-rendered').innerHTML = data.html;
    } catch (e) {
      document.getElementById('preview-rendered').innerHTML =
        '<p style="color: var(--danger)">Failed to render preview</p>';
    }
    document.getElementById('preview-raw').textContent = markdown;
  },

  showTab(tab) {
    this.activeTab = tab;
    const previewEl = document.getElementById('preview-rendered');
    const rawEl = document.getElementById('preview-raw');
    const previewBtn = document.getElementById('tab-preview');
    const rawBtn = document.getElementById('tab-raw');

    if (tab === 'preview') {
      previewEl.style.display = 'block';
      rawEl.style.display = 'none';
      previewBtn.dataset.active = 'true';
      rawBtn.dataset.active = '';
    } else {
      previewEl.style.display = 'none';
      rawEl.style.display = 'block';
      previewBtn.dataset.active = '';
      rawBtn.dataset.active = 'true';
    }
  },

  copy() {
    if (!this.currentReadme) return;
    navigator.clipboard.writeText(this.currentReadme).then(() => {
      showToast('Copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  },

  download() {
    if (!this.currentReadme) return;
    const blob = new Blob([this.currentReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded README.md', 'success');
  },

  async validate() {
    if (!this.currentReadme) {
      showToast('No README to validate', 'error');
      return;
    }

    const btn = document.getElementById('validate-btn');
    btn.disabled = true;
    btn.textContent = 'Checking...';

    try {
      const data = await api.post('/api/readme/validate', { markdown: this.currentReadme });

      let msg = `Badges: ${data.working}/${data.total} working`;
      if (data.broken > 0) {
        msg += ` | ${data.broken} broken`;
        const brokenList = data.details
          .filter(d => !d.working)
          .map(d => d.alt || d.url)
          .join(', ');
        chatUI.addMessage('system',
          `Badge validation: ${data.broken} broken badge(s) found: ${brokenList}. Ask the AI to fix them!`
        );
        showToast(msg, 'error');
      } else {
        showToast('All badges working!', 'success');
        chatUI.addMessage('system', 'All badge URLs validated successfully!');
      }
    } catch (e) {
      showToast('Validation failed: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Validate';
    }
  },

  deploy() {
    if (!this.currentReadme) {
      showToast('No README to deploy', 'error');
      return;
    }
    const username = auth.user?.login;
    document.getElementById('modal-message').textContent =
      `This will push your generated README to the repository "${username}/${username}" on GitHub. If the repo doesn't exist, it will be created. Continue?`;
    document.getElementById('deploy-modal').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('deploy-modal').style.display = 'none';
  },

  async confirmDeploy() {
    const confirmBtn = document.getElementById('modal-confirm');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deploying...';

    try {
      const data = await api.post('/api/github/deploy', { readme: this.currentReadme });
      this.closeModal();
      showToast('Deployed successfully!', 'success');
      chatUI.addMessage('system',
        `README deployed! View your profile: ${data.url}`
      );
    } catch (e) {
      this.closeModal();
      showToast(`Deploy failed: ${e.message}`, 'error');
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Deploy';
    }
  }
};
