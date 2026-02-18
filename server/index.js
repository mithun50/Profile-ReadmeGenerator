const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');
const config = require('./config');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const githubRoutes = require('./routes/github');
const readmeRoutes = require('./routes/readme');

const app = express();

// Trust proxy if behind reverse proxy
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'", "https://github.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Global rate limit: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', globalLimiter);

// Strict rate limit for AI chat: 20 requests per minute
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many messages. Please slow down.' }
});
app.use('/api/chat/send', chatLimiter);

// Strict rate limit for deploy: 5 per 10 minutes
const deployLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Deploy rate limited. Try again later.' }
});
app.use('/api/github/deploy', deployLimiter);

// Auth rate limit: 10 per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts.' }
});
app.use('/auth/', authLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Session with CSRF token generation
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  name: '_sid',
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Generate CSRF token per session
app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// CSRF protection for state-changing API requests
app.use('/api/', (req, res, next) => {
  if (req.method === 'GET') return next();

  const token = req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
});

// Expose CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ token: req.session.csrfToken });
});

app.use('/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/readme', readmeRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
