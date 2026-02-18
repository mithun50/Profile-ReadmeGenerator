const GITHUB_API = 'https://api.github.com';

function headers(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
}

// Fetch full user profile
async function fetchUserProfile(token) {
  const res = await fetch(`${GITHUB_API}/user`, { headers: headers(token) });
  if (!res.ok) return null;
  return res.json();
}

// Fetch user's top repos (sorted by stars, non-fork)
async function fetchTopRepos(token, username, limit = 6) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=stars&direction=desc&per_page=100&type=owner`,
    { headers: headers(token) }
  );
  if (!res.ok) return [];
  const repos = await res.json();
  return repos
    .filter(r => !r.fork && !r.private)
    .slice(0, limit)
    .map(r => ({
      name: r.name,
      description: r.description || '',
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      url: r.html_url,
      homepage: r.homepage || null,
      topics: r.topics || []
    }));
}

// Aggregate languages across all repos
async function fetchLanguages(token, username) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&type=owner`,
    { headers: headers(token) }
  );
  if (!res.ok) return {};
  const repos = await res.json();
  const langCounts = {};
  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  }
  // Sort by count descending
  return Object.fromEntries(
    Object.entries(langCounts).sort((a, b) => b[1] - a[1])
  );
}

// Fetch user's social accounts (GitHub API)
async function fetchSocialAccounts(token) {
  const res = await fetch(`${GITHUB_API}/user/social_accounts`, {
    headers: headers(token)
  });
  if (!res.ok) return [];
  return res.json();
}

// Fetch user's recent activity/events
async function fetchRecentActivity(token, username) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/events/public?per_page=30`,
    { headers: headers(token) }
  );
  if (!res.ok) return {};
  const events = await res.json();
  const types = {};
  for (const e of events) {
    types[e.type] = (types[e.type] || 0) + 1;
  }
  return types;
}

// Fetch organizations
async function fetchOrgs(token, username) {
  const res = await fetch(`${GITHUB_API}/users/${username}/orgs`, {
    headers: headers(token)
  });
  if (!res.ok) return [];
  const orgs = await res.json();
  return orgs.map(o => ({ login: o.login, avatar: o.avatar_url, url: `https://github.com/${o.login}` }));
}

// Aggregate all profile data
async function fetchFullProfileData(token, username) {
  const [profile, topRepos, languages, socials, orgs, activity] = await Promise.all([
    fetchUserProfile(token),
    fetchTopRepos(token, username),
    fetchLanguages(token, username),
    fetchSocialAccounts(token),
    fetchOrgs(token, username),
    fetchRecentActivity(token, username)
  ]);

  return {
    profile: profile ? {
      login: profile.login,
      name: profile.name,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      blog: profile.blog,
      twitter_username: profile.twitter_username,
      email: profile.email,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
      avatar_url: profile.avatar_url,
      hireable: profile.hireable
    } : null,
    topRepos,
    languages,
    socials,
    orgs,
    activity
  };
}

// Check if username/username repo exists
async function checkProfileRepo(token, username) {
  const res = await fetch(`${GITHUB_API}/repos/${username}/${username}`, {
    headers: headers(token)
  });
  if (res.status === 200) {
    return { exists: true, repo: await res.json() };
  }
  return { exists: false };
}

// Create the profile repo
async function createProfileRepo(token, username) {
  const res = await fetch(`${GITHUB_API}/user/repos`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      name: username,
      description: 'My GitHub profile README',
      public: true,
      auto_init: true
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create repository');
  }
  return res.json();
}

// Get README file SHA (needed for updates)
async function getReadmeSha(token, username) {
  const res = await fetch(`${GITHUB_API}/repos/${username}/${username}/contents/README.md`, {
    headers: headers(token)
  });
  if (res.status === 200) {
    const data = await res.json();
    return data.sha;
  }
  return null;
}

// Push README content to the repo
async function pushReadme(token, username, content, sha) {
  const body = {
    message: 'Update profile README',
    content: Buffer.from(content).toString('base64'),
    committer: {
      name: 'Profile README Generator',
      email: 'noreply@profile-readme-gen.app'
    }
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${GITHUB_API}/repos/${username}/${username}/contents/README.md`, {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to push README');
  }
  return res.json();
}

module.exports = {
  fetchFullProfileData,
  checkProfileRepo,
  createProfileRepo,
  getReadmeSha,
  pushReadme
};
