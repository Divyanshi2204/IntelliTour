const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY' });
const MODEL = 'llama-3.3-70b-versatile';

// ── In-memory cache (Map) ─────────────────────────────────────────────────────
const cache = new Map();

async function callGroq(systemPrompt, userMessage, cacheKey) {
  if (cache.has(cacheKey)) {
    console.log(`[groqTravelService] Cache HIT: ${cacheKey}`);
    return cache.get(cacheKey);
  }

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const raw = response.choices[0]?.message?.content || '{}';
  const result = JSON.parse(raw);
  cache.set(cacheKey, result);
  return result;
}

// ── 1. generatePackingList ────────────────────────────────────────────────────
async function generatePackingList(destination, month, activities, days) {
  const cacheKey = `packing:${destination}:${month}:${days}:${[...activities].sort().join(',')}`;

  const systemPrompt = `You are a professional travel packing advisor.
Return ONLY a single raw JSON object with NO markdown, NO explanation, NO backticks.
The JSON must match this exact schema:
{
  "destination": "string",
  "month": "string",
  "days": number,
  "categories": {
    "clothing": ["item", ...],
    "toiletries": ["item", ...],
    "documents": ["item", ...],
    "electronics": ["item", ...],
    "medications": ["item", ...],
    "miscellaneous": ["item", ...]
  },
  "note": "optional string — only include if destination is unknown or input is too vague"
}
Tailor items to the destination climate in that month and the activities listed.
For unknown destinations, still return a generic list and set the "note" field.`;

  const userMessage = `Destination: ${destination}. Month: ${month}. Trip duration: ${days} days. Activities: ${activities.length ? activities.join(', ') : 'general tourism'}.`;

  return callGroq(systemPrompt, userMessage, cacheKey);
}

// ── 2. estimateTripCost ───────────────────────────────────────────────────────
async function estimateTripCost(destination, days, companions, budget) {
  const cacheKey = `cost:${destination}:${days}:${companions}:${budget}`;

  const systemPrompt = `You are an expert travel budget analyst.
Return ONLY a single raw JSON object with NO markdown, NO explanation, NO backticks.
The JSON must match this exact schema:
{
  "destination": "string",
  "days": number,
  "companions": number,
  "currency": "USD",
  "dailyBreakdown": {
    "accommodation": { "low": number, "high": number, "note": "string" },
    "food": { "low": number, "high": number, "note": "string" },
    "transport": { "low": number, "high": number, "note": "string" },
    "activities": { "low": number, "high": number, "note": "string" }
  },
  "totalEstimate": { "low": number, "high": number },
  "tips": ["money saving tip", ...],
  "note": "optional string — only if destination unknown or vague"
}
All monetary values are per person per day in USD unless destination currency is well-known.
"totalEstimate" should multiply daily totals by number of days.`;

  const userMessage = `Destination: ${destination}. Duration: ${days} days. Companions (total travellers): ${companions}. Approximate budget hint: ${budget || 'not specified'}.`;

  return callGroq(systemPrompt, userMessage, cacheKey);
}

// ── 3. getWeatherInsights ─────────────────────────────────────────────────────
async function getWeatherInsights(destination, month) {
  const cacheKey = `weather:${destination}:${month}`;

  const systemPrompt = `You are a climatology and travel weather expert.
Return ONLY a single raw JSON object with NO markdown, NO explanation, NO backticks.
The JSON must match this exact schema:
{
  "destination": "string",
  "month": "string",
  "temperature": { "min": number, "max": number, "unit": "°C" },
  "rainfall": "string (e.g. Low — 30mm avg)",
  "humidity": "string (e.g. Moderate — 65%)",
  "conditions": "1-sentence description of typical conditions",
  "whatToExpect": "2-3 sentences on what travellers will experience",
  "bestTimeToVisit": "string describing ideal travel months",
  "packingTips": ["tip", ...],
  "note": "optional string — only if destination unknown or vague"
}`;

  const userMessage = `Destination: ${destination}. Month of travel: ${month}.`;

  return callGroq(systemPrompt, userMessage, cacheKey);
}

// ── 4. askTravelExpert ────────────────────────────────────────────────────────
async function askTravelExpert(question, destination) {
  // Expert answers are not cached — questions are open-ended
  const systemPrompt = `You are a knowledgeable, friendly travel expert with deep expertise in global destinations.
Return ONLY a single raw JSON object with NO markdown, NO explanation, NO backticks.
The JSON must match this exact schema:
{
  "answer": "clear, direct answer to the question (2-4 sentences)",
  "tips": ["actionable tip", ...],
  "warnings": ["important warning if any", ...],
  "recommendations": ["specific place/product/service recommendation", ...],
  "note": "optional string — only if question is unanswerable or too vague"
}
If the question is unrelated to travel, set answer to an appropriate polite redirect and leave other arrays empty.`;

  const userMessage = `Destination context: ${destination}. Traveller's question: ${question}`;

  return callGroq(systemPrompt, userMessage, `expert:${Date.now()}`);
}

module.exports = { generatePackingList, estimateTripCost, getWeatherInsights, askTravelExpert };
