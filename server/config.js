const dotenv = require('dotenv');
dotenv.config();

const required = [
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GROQ_API_KEY',
  'SESSION_SECRET'
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  session: {
    secret: process.env.SESSION_SECRET
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL || 'http://localhost:3000/auth/callback',
    scopes: 'repo user'
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile'
  }
};
