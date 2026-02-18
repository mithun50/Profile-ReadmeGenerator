const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const githubService = require('../services/githubService');
const router = express.Router();

// Check if profile repo exists
router.get('/check-repo', requireAuth, async (req, res) => {
  try {
    const { user, accessToken } = req.session;
    const result = await githubService.checkProfileRepo(accessToken, user.login);
    res.json(result);
  } catch (err) {
    console.error('Check repo error:', err);
    res.status(500).json({ error: 'Failed to check repository' });
  }
});

// Deploy README to GitHub
router.post('/deploy', requireAuth, async (req, res) => {
  try {
    const { user, accessToken, generatedReadme } = req.session;
    const readme = req.body.readme || generatedReadme;

    if (!readme) {
      return res.status(400).json({ error: 'No README content to deploy. Generate one first.' });
    }

    // Check if repo exists, create if not
    const repoCheck = await githubService.checkProfileRepo(accessToken, user.login);
    if (!repoCheck.exists) {
      await githubService.createProfileRepo(accessToken, user.login);
      // Wait briefly for repo to initialize
      await new Promise(r => setTimeout(r, 2000));
    }

    // Get existing README SHA
    const sha = await githubService.getReadmeSha(accessToken, user.login);

    // Push the README
    const result = await githubService.pushReadme(accessToken, user.login, readme, sha);

    res.json({
      success: true,
      url: `https://github.com/${user.login}`,
      commitUrl: result.commit?.html_url
    });
  } catch (err) {
    console.error('Deploy error:', err);
    res.status(500).json({ error: `Deploy failed: ${err.message}` });
  }
});

module.exports = router;
