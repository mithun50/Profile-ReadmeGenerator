const chatUI = {
  selectedTemplate: 'detailed',
  sending: false,

  init() {
    this.messagesEl = document.getElementById('messages');
    this.inputEl = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('send-btn');
    this.statusEl = document.getElementById('chat-status');

    // Auto-resize textarea
    this.inputEl.addEventListener('input', () => {
      this.inputEl.style.height = 'auto';
      this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 120) + 'px';
    });
  },

  async loadTemplates() {
    try {
      const templates = await api.get('/api/readme/templates');
      const container = document.getElementById('template-options');
      container.innerHTML = '';
      templates.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'template-btn' + (t.id === this.selectedTemplate ? ' active' : '');
        btn.textContent = `${t.icon} ${t.name}`;
        btn.title = t.description;
        btn.onclick = () => this.selectTemplate(t.id);
        btn.dataset.id = t.id;
        container.appendChild(btn);
      });
    } catch (e) {
      console.error('Failed to load templates:', e);
    }
  },

  selectTemplate(id) {
    this.selectedTemplate = id;
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });
  },

  async loadHistory() {
    try {
      const data = await api.get('/api/chat/history');
      if (data.template) {
        this.selectedTemplate = data.template;
        this.selectTemplate(data.template);
      }
      if (data.history && data.history.length > 0) {
        data.history.forEach(msg => {
          this.addMessage(msg.role === 'user' ? 'user' : 'ai', msg.content);
        });
      } else {
        this.addMessage('system', 'Choose a template style above, then say "hi" to start building your README!');
      }
      if (data.hasReadme && data.readme) {
        preview.show(data.readme);
      }
    } catch (e) {
      this.addMessage('system', 'Choose a template style above, then say "hi" to start building your README!');
    }
  },

  async send() {
    if (this.sending) return;
    const message = this.inputEl.value.trim();
    if (!message) return;

    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';
    this.addMessage('user', message);
    this.setSending(true);
    this.showTyping();

    try {
      const data = await api.post('/api/chat/send', {
        message,
        template: this.selectedTemplate
      });

      this.hideTyping();
      this.addMessage('ai', data.reply);

      if (data.hasReadme && data.readme) {
        preview.show(data.readme);
      }
    } catch (e) {
      this.hideTyping();
      this.addMessage('system', `Error: ${e.message}`);
    } finally {
      this.setSending(false);
      this.inputEl.focus();
    }
  },

  async reset() {
    try {
      await api.post('/api/chat/reset');
      this.messagesEl.innerHTML = '';
      preview.hide();
      this.addMessage('system', 'Conversation reset. Say "hi" to start again!');
    } catch (e) {
      showToast('Failed to reset chat', 'error');
    }
  },

  addMessage(type, content) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;

    if (type === 'ai') {
      // Strip README markers for display
      let display = content
        .replace(/<!--README_START-->[\s\S]*?<!--README_END-->/g, '')
        .trim();
      if (!display) {
        display = 'README generated! Check the preview panel.';
      }
      div.innerHTML = this.formatMarkdown(display);
    } else {
      div.textContent = content;
    }

    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  },

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  },

  showTyping() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typing';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  },

  hideTyping() {
    const el = document.getElementById('typing');
    if (el) el.remove();
  },

  setSending(state) {
    this.sending = state;
    this.sendBtn.disabled = state;
    this.inputEl.disabled = state;
    this.statusEl.textContent = state ? 'AI is thinking...' : '';
  }
};
