const Groq = require('groq-sdk');
const config = require('../config');

const groq = new Groq({ apiKey: config.groq.apiKey });

async function chat(messages) {
  const response = await groq.chat.completions.create({
    model: config.groq.model,
    messages,
    temperature: 0.7,
    max_tokens: 8192
  });

  return response.choices[0]?.message?.content || '';
}

module.exports = { chat };
