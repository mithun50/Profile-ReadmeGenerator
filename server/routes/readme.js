const express = require('express');
const { marked } = require('marked');
const { requireAuth } = require('../middleware/authMiddleware');
const { getTemplates } = require('../services/templateService');
const { isValidBadgeUrl } = require('../services/badgeService');
const router = express.Router();

// List available templates
router.get('/templates', (req, res) => {
  res.json(getTemplates());
});

// Render markdown to HTML preview
router.post('/preview', requireAuth, (req, res) => {
  try {
    const { markdown } = req.body;
    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }
    const html = marked(markdown);
    res.json({ html });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Failed to render preview' });
  }
});

// Validate badge URLs in a README
router.post('/validate', requireAuth, async (req, res) => {
  try {
    const { markdown } = req.body;
    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    // Extract all image URLs from markdown
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const badges = [];
    let match;

    while ((match = imgRegex.exec(markdown)) !== null) {
      const [full, alt, url] = match;
      badges.push({ alt, url, fromAllowed: isValidBadgeUrl(url) });
    }

    // Check which badges are reachable
    const results = await Promise.all(
      badges.map(async (badge) => {
        try {
          const response = await fetch(badge.url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          return { ...badge, status: response.status, working: response.ok };
        } catch {
          return { ...badge, status: 0, working: false };
        }
      })
    );

    const broken = results.filter(r => !r.working);
    const unknown = results.filter(r => !r.fromAllowed);

    res.json({
      total: results.length,
      working: results.filter(r => r.working).length,
      broken: broken.length,
      unknownSources: unknown.length,
      details: results
    });
  } catch (err) {
    console.error('Validate error:', err);
    res.status(500).json({ error: 'Validation failed' });
  }
});

module.exports = router;
