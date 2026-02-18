function requireAuth(req, res, next) {
  if (!req.session || !req.session.user || !req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated. Please log in with GitHub.' });
  }
  next();
}

module.exports = { requireAuth };
