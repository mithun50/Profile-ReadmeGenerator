# Profile README Generator

AI-powered web app that generates stunning GitHub profile READMEs through an interactive chat interface, then deploys them directly to your GitHub profile with one click.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Features

- **AI Chat Interview** — Groq-powered AI (LLaMA 3.3 70B) asks you questions one at a time and crafts your README
- **Auto-Fetch GitHub Data** — Pulls your top repos, languages, bio, social accounts, and orgs automatically
- **150+ Verified Badges** — Tech stack, frameworks, databases, cloud, DevOps, AI/ML — all with correct shields.io logos
- **4 Template Styles** — Minimal, Detailed, Creative, Professional
- **Live Preview** — Split-panel markdown preview with rendered and raw views
- **Badge Validation** — Checks every badge URL is reachable before you deploy
- **One-Click Deploy** — Pushes README directly to your `username/username` GitHub profile repo
- **Copy & Download** — Export your README as a file or copy to clipboard
- **Secure** — Helmet CSP headers, CSRF protection, rate limiting, session hardening

## Quick Start

### Prerequisites

- Node.js 18+
- A [GitHub OAuth App](https://github.com/settings/developers)
- A [Groq API Key](https://console.groq.com/keys)

### Setup

```bash
git clone https://github.com/mithun50/Profile-ReadmeGenerator.git
cd Profile-ReadmeGenerator
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GROQ_API_KEY=your_groq_api_key
SESSION_SECRET=any_random_string
PORT=3000
CALLBACK_URL=http://localhost:3000/auth/callback
```

### GitHub OAuth App Settings

When creating your OAuth App at [github.com/settings/developers](https://github.com/settings/developers):

| Field | Value |
|-------|-------|
| Application name | `Profile README Generator` |
| Homepage URL | `http://localhost:3000` |
| Authorization callback URL | `http://localhost:3000/auth/callback` |

### Run

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Login** — Authenticate with GitHub OAuth
2. **Choose a template** — Minimal, Detailed, Creative, or Professional
3. **Chat with AI** — Answer questions about yourself (AI already knows your GitHub data)
4. **Preview** — See your README rendered in real-time
5. **Validate** — Check all badge URLs are working
6. **Deploy** — Push to your GitHub profile repo with one click

## Template Styles

| Style | Description |
|-------|-------------|
| **Minimal** | Clean, whitespace-focused, essentials only |
| **Detailed** | Stats cards, badges, project showcase, trophies |
| **Creative** | Animated headers, contribution snake, dev quotes, visual flair |
| **Professional** | Corporate-friendly, experience-focused, clean layout |

## Project Structure

```
Profile-ReadmeGenerator/
├── server/
│   ├── index.js                  # Express app with security middleware
│   ├── config.js                 # Environment variable loader
│   ├── routes/
│   │   ├── auth.js               # GitHub OAuth flow
│   │   ├── chat.js               # AI chat with auto-fetched profile data
│   │   ├── github.js             # Repo check & deploy
│   │   └── readme.js             # Templates, preview, badge validation
│   ├── services/
│   │   ├── groqService.js        # Groq SDK wrapper
│   │   ├── githubService.js      # GitHub API (profile, repos, languages, socials)
│   │   ├── templateService.js    # Template definitions
│   │   └── badgeService.js       # 150+ verified badge mappings & validation
│   ├── middleware/
│   │   └── authMiddleware.js     # Session auth check
│   └── prompts/
│       └── systemPrompt.js       # AI system prompt with badge catalog
├── public/
│   ├── index.html                # Single-page app
│   ├── css/styles.css            # Dark theme UI
│   └── js/
│       ├── app.js                # Init & event binding
│       ├── chat.js               # Chat UI
│       ├── auth.js               # Login/logout
│       ├── preview.js            # Preview, validate, deploy
│       └── api.js                # Fetch wrapper with CSRF
├── .env.example
├── .gitignore
└── package.json
```

## API Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/auth/github` | No | Start OAuth |
| GET | `/auth/callback` | No | OAuth callback |
| GET | `/auth/logout` | No | Destroy session |
| GET | `/auth/status` | No | Check login state |
| POST | `/api/chat/send` | Yes | Send message to AI |
| POST | `/api/chat/reset` | Yes | Reset conversation |
| GET | `/api/chat/history` | Yes | Get chat history |
| GET | `/api/readme/templates` | No | List templates |
| POST | `/api/readme/preview` | Yes | Render markdown to HTML |
| POST | `/api/readme/validate` | Yes | Validate all badge URLs |
| GET | `/api/github/check-repo` | Yes | Check profile repo exists |
| POST | `/api/github/deploy` | Yes | Push README to GitHub |

## Security

- **Helmet** — CSP, X-Frame-Options, HSTS, and more
- **CSRF tokens** — Required on all POST API requests
- **Rate limiting** — Per-endpoint limits (chat: 20/min, deploy: 5/10min, auth: 10/15min)
- **Input validation** — Message length caps, template whitelisting, history size limits
- **Session hardening** — httpOnly, sameSite=lax, secure in production

## Tech Stack

- **Backend:** Node.js, Express, express-session
- **AI:** Groq SDK (LLaMA 3.3 70B Versatile)
- **Auth:** GitHub OAuth
- **Security:** Helmet, express-rate-limit, CSRF tokens
- **Frontend:** Vanilla HTML/CSS/JS (no build step)
- **Markdown:** marked

## License

MIT
