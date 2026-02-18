const express = require('express');
const config = require('../config');
const router = express.Router();

// Start GitHub OAuth flow
router.get('/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: config.github.callbackUrl,
    scope: config.github.scopes,
    state: Math.random().toString(36).substring(7)
  });
  req.session.oauthState = params.get('state');
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// GitHub OAuth callback
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  if (state !== req.session.oauthState) {
    return res.redirect('/?error=state_mismatch');
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
        redirect_uri: config.github.callbackUrl
      })
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('OAuth token error:', tokenData);
      return res.redirect('/?error=token_exchange');
    }

    // Fetch user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userRes.json();

    // Store in session
    req.session.accessToken = tokenData.access_token;
    req.session.user = {
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following
    };

    // Initialize chat history
    req.session.chatHistory = [];
    req.session.generatedReadme = null;

    res.redirect('/');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect('/?error=callback_failed');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Check login status
router.get('/status', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      authenticated: true,
      user: req.session.user
    });
  }
  res.json({ authenticated: false });
});

module.exports = router;
