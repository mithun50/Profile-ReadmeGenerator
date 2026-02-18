const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const groqService = require('../services/groqService');
const { getSystemPrompt } = require('../prompts/systemPrompt');
const { fetchFullProfileData } = require('../services/githubService');
const { getBadgeCatalog } = require('../services/badgeService');
const router = express.Router();

const VALID_TEMPLATES = ['minimal', 'detailed', 'creative', 'professional'];
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 50;

// Fetch and cache GitHub profile data in session
async function ensureProfileData(req) {
  if (!req.session.profileData) {
    try {
      req.session.profileData = await fetchFullProfileData(
        req.session.accessToken,
        req.session.user.login
      );
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      req.session.profileData = null;
    }
  }
  return req.session.profileData;
}

// Send a message and get AI response
router.post('/send', requireAuth, async (req, res) => {
  try {
    const { message, template } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` });
    }

    if (!req.session.chatHistory) {
      req.session.chatHistory = [];
    }

    const templateStyle = VALID_TEMPLATES.includes(template) ? template : (req.session.templateStyle || 'detailed');
    req.session.templateStyle = templateStyle;

    if (req.session.chatHistory.length > MAX_HISTORY_LENGTH) {
      req.session.chatHistory = req.session.chatHistory.slice(-MAX_HISTORY_LENGTH);
    }

    // Fetch GitHub profile data (cached in session)
    const profileData = await ensureProfileData(req);
    const badgeCatalog = getBadgeCatalog();

    // Build system prompt with real data
    const systemMsg = {
      role: 'system',
      content: getSystemPrompt(templateStyle, req.session.user.login, profileData, badgeCatalog)
    };

    req.session.chatHistory.push({
      role: 'user',
      content: message.trim()
    });

    const messages = [systemMsg, ...req.session.chatHistory];

    const reply = await groqService.chat(messages);

    req.session.chatHistory.push({
      role: 'assistant',
      content: reply
    });

    // Extract README if present
    const readmeMatch = reply.match(/<!--README_START-->([\s\S]*?)<!--README_END-->/);
    if (readmeMatch) {
      req.session.generatedReadme = readmeMatch[1].trim();
    }

    res.json({
      reply,
      hasReadme: !!req.session.generatedReadme,
      readme: req.session.generatedReadme || null
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
});

// Reset conversation
router.post('/reset', requireAuth, (req, res) => {
  req.session.chatHistory = [];
  req.session.generatedReadme = null;
  req.session.templateStyle = null;
  req.session.profileData = null; // re-fetch on next chat
  res.json({ success: true });
});

// Get chat history
router.get('/history', requireAuth, (req, res) => {
  res.json({
    history: req.session.chatHistory || [],
    hasReadme: !!req.session.generatedReadme,
    readme: req.session.generatedReadme || null,
    template: req.session.templateStyle || 'detailed'
  });
});

module.exports = router;
