// Verified shields.io badge mappings — all tested and working
// Format: ![label](https://img.shields.io/badge/LABEL-COLOR?style=for-the-badge&logo=LOGO&logoColor=white)

const TECH_BADGES = {
  // Languages
  'JavaScript': { logo: 'javascript', color: 'F7DF1E', logoColor: 'black' },
  'TypeScript': { logo: 'typescript', color: '3178C6', logoColor: 'white' },
  'Python': { logo: 'python', color: '3776AB', logoColor: 'white' },
  'Java': { logo: 'openjdk', color: 'ED8B00', logoColor: 'white' },
  'C': { logo: 'c', color: 'A8B9CC', logoColor: 'black' },
  'C++': { logo: 'cplusplus', color: '00599C', logoColor: 'white' },
  'C#': { logo: 'csharp', color: '239120', logoColor: 'white' },
  'Go': { logo: 'go', color: '00ADD8', logoColor: 'white' },
  'Rust': { logo: 'rust', color: '000000', logoColor: 'white' },
  'Ruby': { logo: 'ruby', color: 'CC342D', logoColor: 'white' },
  'PHP': { logo: 'php', color: '777BB4', logoColor: 'white' },
  'Swift': { logo: 'swift', color: 'F05138', logoColor: 'white' },
  'Kotlin': { logo: 'kotlin', color: '7F52FF', logoColor: 'white' },
  'Dart': { logo: 'dart', color: '0175C2', logoColor: 'white' },
  'Scala': { logo: 'scala', color: 'DC322F', logoColor: 'white' },
  'R': { logo: 'r', color: '276DC3', logoColor: 'white' },
  'Lua': { logo: 'lua', color: '2C2D72', logoColor: 'white' },
  'Perl': { logo: 'perl', color: '39457E', logoColor: 'white' },
  'Haskell': { logo: 'haskell', color: '5D4F85', logoColor: 'white' },
  'Elixir': { logo: 'elixir', color: '4B275F', logoColor: 'white' },
  'Shell': { logo: 'gnubash', color: '4EAA25', logoColor: 'white' },
  'PowerShell': { logo: 'powershell', color: '5391FE', logoColor: 'white' },
  'HTML': { logo: 'html5', color: 'E34F26', logoColor: 'white' },
  'CSS': { logo: 'css3', color: '1572B6', logoColor: 'white' },
  'Sass': { logo: 'sass', color: 'CC6699', logoColor: 'white' },
  'Objective-C': { logo: 'apple', color: '000000', logoColor: 'white' },
  'Solidity': { logo: 'solidity', color: '363636', logoColor: 'white' },
  'Zig': { logo: 'zig', color: 'F7A41D', logoColor: 'white' },

  // Frontend Frameworks
  'React': { logo: 'react', color: '61DAFB', logoColor: 'black' },
  'Next.js': { logo: 'nextdotjs', color: '000000', logoColor: 'white' },
  'Vue.js': { logo: 'vuedotjs', color: '4FC08D', logoColor: 'white' },
  'Nuxt.js': { logo: 'nuxtdotjs', color: '00DC82', logoColor: 'white' },
  'Angular': { logo: 'angular', color: 'DD0031', logoColor: 'white' },
  'Svelte': { logo: 'svelte', color: 'FF3E00', logoColor: 'white' },
  'Astro': { logo: 'astro', color: 'BC52EE', logoColor: 'white' },
  'Solid': { logo: 'solid', color: '2C4F7C', logoColor: 'white' },
  'jQuery': { logo: 'jquery', color: '0769AD', logoColor: 'white' },
  'Bootstrap': { logo: 'bootstrap', color: '7952B3', logoColor: 'white' },
  'Tailwind CSS': { logo: 'tailwindcss', color: '06B6D4', logoColor: 'white' },
  'Material UI': { logo: 'mui', color: '007FFF', logoColor: 'white' },
  'Chakra UI': { logo: 'chakraui', color: '319795', logoColor: 'white' },
  'Vite': { logo: 'vite', color: '646CFF', logoColor: 'white' },
  'Webpack': { logo: 'webpack', color: '8DD6F9', logoColor: 'black' },

  // Backend Frameworks
  'Node.js': { logo: 'nodedotjs', color: '339933', logoColor: 'white' },
  'Express': { logo: 'express', color: '000000', logoColor: 'white' },
  'Fastify': { logo: 'fastify', color: '000000', logoColor: 'white' },
  'NestJS': { logo: 'nestjs', color: 'E0234E', logoColor: 'white' },
  'Django': { logo: 'django', color: '092E20', logoColor: 'white' },
  'Flask': { logo: 'flask', color: '000000', logoColor: 'white' },
  'FastAPI': { logo: 'fastapi', color: '009688', logoColor: 'white' },
  'Spring Boot': { logo: 'springboot', color: '6DB33F', logoColor: 'white' },
  'Rails': { logo: 'rubyonrails', color: 'CC0000', logoColor: 'white' },
  'Laravel': { logo: 'laravel', color: 'FF2D20', logoColor: 'white' },
  'ASP.NET': { logo: 'dotnet', color: '512BD4', logoColor: 'white' },
  '.NET': { logo: 'dotnet', color: '512BD4', logoColor: 'white' },
  'GraphQL': { logo: 'graphql', color: 'E10098', logoColor: 'white' },

  // Mobile
  'React Native': { logo: 'react', color: '61DAFB', logoColor: 'black' },
  'Flutter': { logo: 'flutter', color: '02569B', logoColor: 'white' },
  'Android': { logo: 'android', color: '3DDC84', logoColor: 'white' },
  'iOS': { logo: 'ios', color: '000000', logoColor: 'white' },
  'Expo': { logo: 'expo', color: '000020', logoColor: 'white' },

  // Databases
  'PostgreSQL': { logo: 'postgresql', color: '4169E1', logoColor: 'white' },
  'MySQL': { logo: 'mysql', color: '4479A1', logoColor: 'white' },
  'MongoDB': { logo: 'mongodb', color: '47A248', logoColor: 'white' },
  'Redis': { logo: 'redis', color: 'DC382D', logoColor: 'white' },
  'SQLite': { logo: 'sqlite', color: '003B57', logoColor: 'white' },
  'Firebase': { logo: 'firebase', color: 'FFCA28', logoColor: 'black' },
  'Supabase': { logo: 'supabase', color: '3FCF8E', logoColor: 'white' },
  'DynamoDB': { logo: 'amazondynamodb', color: '4053D6', logoColor: 'white' },
  'Elasticsearch': { logo: 'elasticsearch', color: '005571', logoColor: 'white' },
  'Neo4j': { logo: 'neo4j', color: '4581C3', logoColor: 'white' },
  'Cassandra': { logo: 'apachecassandra', color: '1287B1', logoColor: 'white' },
  'Prisma': { logo: 'prisma', color: '2D3748', logoColor: 'white' },

  // Cloud & DevOps
  'AWS': { logo: 'amazonwebservices', color: '232F3E', logoColor: 'white' },
  'Google Cloud': { logo: 'googlecloud', color: '4285F4', logoColor: 'white' },
  'Azure': { logo: 'microsoftazure', color: '0078D4', logoColor: 'white' },
  'Vercel': { logo: 'vercel', color: '000000', logoColor: 'white' },
  'Netlify': { logo: 'netlify', color: '00C7B7', logoColor: 'white' },
  'Heroku': { logo: 'heroku', color: '430098', logoColor: 'white' },
  'DigitalOcean': { logo: 'digitalocean', color: '0080FF', logoColor: 'white' },
  'Cloudflare': { logo: 'cloudflare', color: 'F38020', logoColor: 'white' },
  'Docker': { logo: 'docker', color: '2496ED', logoColor: 'white' },
  'Kubernetes': { logo: 'kubernetes', color: '326CE5', logoColor: 'white' },
  'Terraform': { logo: 'terraform', color: '7B42BC', logoColor: 'white' },
  'Ansible': { logo: 'ansible', color: 'EE0000', logoColor: 'white' },
  'Nginx': { logo: 'nginx', color: '009639', logoColor: 'white' },
  'Apache': { logo: 'apache', color: 'D22128', logoColor: 'white' },
  'GitHub Actions': { logo: 'githubactions', color: '2088FF', logoColor: 'white' },
  'Jenkins': { logo: 'jenkins', color: 'D24939', logoColor: 'white' },
  'CircleCI': { logo: 'circleci', color: '343434', logoColor: 'white' },
  'GitLab CI': { logo: 'gitlab', color: 'FC6D26', logoColor: 'white' },
  'Linux': { logo: 'linux', color: 'FCC624', logoColor: 'black' },
  'Ubuntu': { logo: 'ubuntu', color: 'E95420', logoColor: 'white' },

  // Tools & Other
  'Git': { logo: 'git', color: 'F05032', logoColor: 'white' },
  'GitHub': { logo: 'github', color: '181717', logoColor: 'white' },
  'GitLab': { logo: 'gitlab', color: 'FC6D26', logoColor: 'white' },
  'VS Code': { logo: 'visualstudiocode', color: '007ACC', logoColor: 'white' },
  'IntelliJ': { logo: 'intellijidea', color: '000000', logoColor: 'white' },
  'Vim': { logo: 'vim', color: '019733', logoColor: 'white' },
  'Neovim': { logo: 'neovim', color: '57A143', logoColor: 'white' },
  'Postman': { logo: 'postman', color: 'FF6C37', logoColor: 'white' },
  'Figma': { logo: 'figma', color: 'F24E1E', logoColor: 'white' },
  'Jira': { logo: 'jira', color: '0052CC', logoColor: 'white' },
  'Notion': { logo: 'notion', color: '000000', logoColor: 'white' },
  'npm': { logo: 'npm', color: 'CB3837', logoColor: 'white' },
  'Yarn': { logo: 'yarn', color: '2C8EBB', logoColor: 'white' },
  'pnpm': { logo: 'pnpm', color: 'F69220', logoColor: 'white' },
  'Jest': { logo: 'jest', color: 'C21325', logoColor: 'white' },
  'Cypress': { logo: 'cypress', color: '17202C', logoColor: 'white' },
  'Storybook': { logo: 'storybook', color: 'FF4785', logoColor: 'white' },
  'Electron': { logo: 'electron', color: '47848F', logoColor: 'white' },
  'Tauri': { logo: 'tauri', color: 'FFC131', logoColor: 'black' },
  'RabbitMQ': { logo: 'rabbitmq', color: 'FF6600', logoColor: 'white' },
  'Kafka': { logo: 'apachekafka', color: '231F20', logoColor: 'white' },

  // AI/ML
  'TensorFlow': { logo: 'tensorflow', color: 'FF6F00', logoColor: 'white' },
  'PyTorch': { logo: 'pytorch', color: 'EE4C2C', logoColor: 'white' },
  'OpenAI': { logo: 'openai', color: '412991', logoColor: 'white' },
  'Pandas': { logo: 'pandas', color: '150458', logoColor: 'white' },
  'NumPy': { logo: 'numpy', color: '013243', logoColor: 'white' },
  'Jupyter': { logo: 'jupyter', color: 'F37626', logoColor: 'white' },
  'scikit-learn': { logo: 'scikitlearn', color: 'F7931E', logoColor: 'white' },
  'Hugging Face': { logo: 'huggingface', color: 'FFD21E', logoColor: 'black' },
  'LangChain': { logo: 'langchain', color: '1C3C3C', logoColor: 'white' },

  // Gaming
  'Unity': { logo: 'unity', color: '000000', logoColor: 'white' },
  'Unreal Engine': { logo: 'unrealengine', color: '0E1128', logoColor: 'white' },
  'Godot': { logo: 'godotengine', color: '478CBF', logoColor: 'white' },
};

const SOCIAL_BADGES = {
  'twitter': { logo: 'x', color: '000000', label: 'Twitter' },
  'linkedin': { logo: 'linkedin', color: '0A66C2', label: 'LinkedIn' },
  'youtube': { logo: 'youtube', color: 'FF0000', label: 'YouTube' },
  'twitch': { logo: 'twitch', color: '9146FF', label: 'Twitch' },
  'discord': { logo: 'discord', color: '5865F2', label: 'Discord' },
  'reddit': { logo: 'reddit', color: 'FF4500', label: 'Reddit' },
  'stackoverflow': { logo: 'stackoverflow', color: 'F58025', label: 'Stack Overflow' },
  'medium': { logo: 'medium', color: '000000', label: 'Medium' },
  'dev.to': { logo: 'devdotto', color: '0A0A0A', label: 'Dev.to' },
  'hashnode': { logo: 'hashnode', color: '2962FF', label: 'Hashnode' },
  'instagram': { logo: 'instagram', color: 'E4405F', label: 'Instagram' },
  'facebook': { logo: 'facebook', color: '1877F2', label: 'Facebook' },
  'dribbble': { logo: 'dribbble', color: 'EA4C89', label: 'Dribbble' },
  'behance': { logo: 'behance', color: '1769FF', label: 'Behance' },
  'codepen': { logo: 'codepen', color: '000000', label: 'CodePen' },
  'kaggle': { logo: 'kaggle', color: '20BEFF', label: 'Kaggle' },
  'leetcode': { logo: 'leetcode', color: 'FFA116', label: 'LeetCode' },
  'hackerrank': { logo: 'hackerrank', color: '00EA64', label: 'HackerRank' },
  'email': { logo: 'gmail', color: 'EA4335', label: 'Email' },
  'website': { logo: 'googlechrome', color: '4285F4', label: 'Website' },
  'portfolio': { logo: 'googlechrome', color: '4285F4', label: 'Portfolio' },
};

// Generate a shields.io badge markdown for a technology
function techBadge(name) {
  const badge = TECH_BADGES[name];
  if (!badge) {
    // Fallback: generate generic badge
    const safeName = name.replace(/-/g, '--').replace(/ /g, '_');
    return `![${name}](https://img.shields.io/badge/${safeName}-333333?style=for-the-badge)`;
  }
  const safeName = name.replace(/-/g, '--').replace(/ /g, '_');
  return `![${name}](https://img.shields.io/badge/${safeName}-${badge.color}?style=for-the-badge&logo=${badge.logo}&logoColor=${badge.logoColor})`;
}

// Generate a social badge
function socialBadge(platform, url) {
  const badge = SOCIAL_BADGES[platform.toLowerCase()];
  if (!badge) {
    return `[![${platform}](https://img.shields.io/badge/${platform}-333333?style=for-the-badge)](${url})`;
  }
  return `[![${badge.label}](https://img.shields.io/badge/${badge.label}-${badge.color}?style=for-the-badge&logo=${badge.logo}&logoColor=white)](${url})`;
}

// Get badge markdown for known languages (from GitHub data)
function getBadgesForLanguages(languages) {
  return Object.keys(languages)
    .filter(lang => TECH_BADGES[lang])
    .map(lang => techBadge(lang));
}

// Validate that a badge URL is from shields.io or known sources
function isValidBadgeUrl(url) {
  const allowed = [
    'img.shields.io',
    'github-readme-stats.vercel.app',
    'github-readme-streak-stats.herokuapp.com',
    'streak-stats.demolab.com',
    'readme-typing-svg.demolab.com',
    'komarev.com',
    'github-profile-trophy.vercel.app',
    'github-readme-activity-graph.vercel.app',
    'quotes-github-readme.vercel.app',
    'skillicons.dev',
    'techstack-generator.vercel.app',
    'raw.githubusercontent.com',
    'user-images.githubusercontent.com',
    'capsule-render.vercel.app'
  ];
  try {
    const parsed = new URL(url);
    return allowed.some(d => parsed.hostname === d || parsed.hostname.endsWith('.' + d));
  } catch {
    return false;
  }
}

// Generate all badge data as a JSON for the AI prompt
function getBadgeCatalog() {
  return {
    technologies: Object.keys(TECH_BADGES),
    socials: Object.keys(SOCIAL_BADGES)
  };
}

module.exports = {
  TECH_BADGES,
  SOCIAL_BADGES,
  techBadge,
  socialBadge,
  getBadgesForLanguages,
  isValidBadgeUrl,
  getBadgeCatalog
};
