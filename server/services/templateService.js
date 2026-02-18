const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple — essentials only',
    icon: '✨'
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'Stats cards, badges, and project showcase',
    icon: '📊'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Animated typing SVG, widgets, and flair',
    icon: '🎨'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate-friendly, experience-focused',
    icon: '💼'
  }
];

function getTemplates() {
  return templates;
}

function getTemplate(id) {
  return templates.find(t => t.id === id) || templates[1]; // default to detailed
}

module.exports = { getTemplates, getTemplate };
