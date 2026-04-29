const Groq = require("groq-sdk");

/**
 * Service to interact with the Groq API (using Llama 3) to generate structured travel itineraries.
 */
class GroqService {
  constructor() {
    // Initialize the SDK. It's OK if GROQ_API_KEY is not set yet;
    // it will throw when generation is called, which we handle.
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY' });
  }

  /**
   * Generates an itinerary based on user parameters using Llama 3 70b in JSON mode.
   *
   * @param {Object} params
   * @param {string} params.destination
   * @param {number} params.days
   * @param {number} params.budget
   * @param {string} params.currency
   * @param {string} params.budgetLevel
   * @param {string[]} params.preferences
   * @returns {Promise<{tripSummary: string, days: Array, rawText: string}>}
   */
  async generateItinerary({ destination, days, budget, currency, budgetLevel, preferences }) {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Missing Groq API Key! Please configure GROQ_API_KEY in the backend .env file.');
    }

    const prefsString = preferences && preferences.length > 0 
      ? preferences.join(', ') 
      : 'General tourist attractions';

    const prompt = `
      You are an expert travel planner. Create a highly detailed, engaging ${days}-day travel itinerary for ${destination}.
      
      Trip Constraints:
      - Total Budget: ${budget} ${currency} (Budget Level: ${budgetLevel})
      - Travel Preferences / Interests: ${prefsString}
      - Number of Days: ${days}
      
      Requirements:
      - Spread the budget realistically across activities, food, and local transport for the duration of the trip.
      - Ensure activities logically flow geographically each day.
      - Include a mix of activities based on preferences.
      - Provide practical tips for activities.
      
      You MUST respond ONLY with a valid JSON object matching this exact schema:
      {
        "tripSummary": "A glowing, exciting 2-3 sentence overview of the trip.",
        "days": [
          {
            "day": 1,
            "title": "A catchy title for the day (e.g., Icons & Elegance)",
            "theme": "The main theme of the day (e.g., Culture, Adventure)",
            "dailySummary": "A brief 1-sentence summary of what to expect on this day.",
            "activities": [
              {
                "time": "09:00 AM",
                "title": "Activity Name",
                "description": "Engaging description of what the user will do here.",
                "location": "Specific venue or area",
                "category": "MUST BE EXACTLY ONE OF: sightseeing, food, adventure, culture, transport, accommodation, other",
                "estimatedCost": "Cost estimate including currency symbol, or 'Free'",
                "tips": "Optional pro-tip for this activity"
              }
            ]
          }
        ]
      }
    `;

    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile", // Using the latest supported Llama 3 70b variant on Groq
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const rawContent = response.choices[0]?.message?.content || "{}";
      const jsonData = JSON.parse(rawContent);

      return {
        tripSummary: jsonData.tripSummary,
        days: jsonData.days,
        rawText: rawContent
      };
    } catch (error) {
      console.error('Groq Service Error:', error);
      throw new Error(`Failed to generate itinerary with AI: ${error.message}`);
    }
  }
}

module.exports = new GroqService();
