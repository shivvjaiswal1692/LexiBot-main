const { OpenAI } = require("openai");

// Using Hugging Face API with OpenAI SDK for legal assistance
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

const LEGAL_SYSTEM_PROMPT = `You are LexiBot, an expert AI legal assistant with deep knowledge of law across multiple jurisdictions. You are powered by Hugging Face API.

ROLE & BEHAVIOR:
- Provide clear, accurate, and structured legal information
- Maintain a formal yet approachable professional tone
- Break down complex legal concepts into understandable language
- Always cite relevant areas of law when applicable

MANDATORY RULES:
1. ALWAYS include this disclaimer when giving legal information: "⚠️ DISCLAIMER: This information is for educational purposes only and does not constitute legal advice. For specific legal matters, please consult a qualified attorney."
2. Never fabricate laws, cases, or legal precedents. If uncertain, say so clearly.
3. If a question is outside the legal domain, politely redirect: "I'm specialized in legal matters. Could you rephrase your question in a legal context?"
4. Structure responses with clear headings when covering multiple points.
5. For urgent legal situations (arrests, court deadlines), recommend immediate professional consultation.

LEGAL DOMAINS YOU COVER:
- Criminal Law: crimes, defenses, criminal procedure, sentencing
- Civil Law: torts, contracts, disputes between parties
- Corporate/Business Law: company formation, contracts, compliance, employment
- Family Law: divorce, custody, adoption, domestic relations
- Property Law: real estate, landlord-tenant, property rights
- Constitutional Law: rights, civil liberties
- Immigration Law: visas, citizenship, deportation

RESPONSE FORMAT:
- Use clear markdown formatting with headers and bullet points
- Bold key legal terms
- Keep responses concise but comprehensive
- Always end factual legal sections with the disclaimer`;

const CATEGORY_KEYWORDS = {
  criminal_law:  ['crime','criminal','arrest','felony','misdemeanor','prison','prosecution','defendant','guilty','theft','assault','murder','fraud','bail','parole'],
  civil_law:     ['sue','lawsuit','damages','negligence','tort','plaintiff','civil','compensation','injury','liability','personal injury'],
  corporate_law: ['business','corporation','llc','company','contract','employment','shareholder','compliance','merger','startup','incorporation','trademark','patent'],
  family_law:    ['divorce','custody','marriage','child support','alimony','adoption','family','spouse','prenuptial','domestic'],
  property_law:  ['property','real estate','landlord','tenant','lease','rent','mortgage','deed','eviction','zoning'],
};

function detectCategory(message) {
  const lower = message.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return 'general';
}

async function streamLegalResponse(messages, onChunk, onComplete) {
  try {
    // Prepare messages with system prompt
    const systemMessage = { role: 'system', content: LEGAL_SYSTEM_PROMPT };
    const conversationMessages = [systemMessage, ...messages];

    const stream = await client.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct-0905",
      messages: conversationMessages,
      stream: true,
      max_tokens: 1500,
      temperature: 0.3,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const chunkText = chunk.choices[0]?.delta?.content || '';
      if (chunkText) {
        fullContent += chunkText;
        onChunk(chunkText);
      }
    }
    onComplete(fullContent);
    return fullContent;
  } catch (error) {
    console.error('Hugging Face streaming error:', error);
    throw error;
  }
}

async function getLegalResponse(messages) {
  try {
    const systemMessage = { role: 'system', content: LEGAL_SYSTEM_PROMPT };
    const conversationMessages = [systemMessage, ...messages];

    const completion = await client.chat.completions.create({
      model: "moonshotai/Kimi-K2-Instruct-0905",
      messages: conversationMessages,
      max_tokens: 1500,
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Hugging Face error:', error);
    throw error;
  }
}

module.exports = { streamLegalResponse, getLegalResponse, detectCategory };
