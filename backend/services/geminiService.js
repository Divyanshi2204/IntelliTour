const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

/**
 * Service to interact with Google Gemini API and generate structured travel itineraries.
 * (Updated to latest SDK)
 */
class GeminiService {
  constructor() {
    // Initialize the SDK. It's OK if GEMINI_API_KEY is not set yet;
    // it will throw when generateContent is called, which we handle.
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');
    
    // Using the recommended model for general text/JSON tasks
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: this._getItinerarySchema(),
      },
    });
  }

  /**
   * Helper to define the strict JSON schema Gemini must return.
   * This guarantees the output perfectly matches our Mongoose Day/Activity schema.
   */
  _getItinerarySchema() {
    return {
      type: SchemaType.OBJECT,
      properties: {
        tripSummary: {
          type: SchemaType.STRING,
          description: 'A glowing, exciting 2-3 sentence overview of the trip.',
        },
        days: {
          type: SchemaType.ARRAY,
          description: 'An array representing each day of the trip.',
          items: {
            type: SchemaType.OBJECT,
            properties: {
              day: {
                type: SchemaType.INTEGER,
                description: 'The day number (1, 2, 3...)',
              },
              title: {
                type: SchemaType.STRING,
                description: 'A catchy title for the day (e.g., Arrival City Walk, Royal Palaces)',
              },
              theme: {
                type: SchemaType.STRING,
                description: 'The main theme of the day (e.g., Culture, Adventure, Relaxation)',
              },
              dailySummary: {
                type: SchemaType.STRING,
                description: 'A brief 1-sentence summary of what to expect on this day.',
              },
              activities: {
                type: SchemaType.ARRAY,
                description: 'The chronological list of activities for this day.',
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    time: {
                      type: SchemaType.STRING,
                      description: 'Start time (e.g., 09:00 AM, 02:00 PM)',
                    },
                    title: {
                      type: SchemaType.STRING,
                      description: 'Name of the activity or place',
                    },
                    description: {
                      type: SchemaType.STRING,
                      description: 'Engaging description of what the user will do here.',
                    },
                    location: {
                      type: SchemaType.STRING,
                      description: 'Specific venue, area, or neighborhood.',
                    },
                    category: {
                      type: SchemaType.STRING,
                      description: 'MUST BE exactly one of: sightseeing, food, adventure, culture, transport, accommodation, other',
                    },
                    estimatedCost: {
                      type: SchemaType.STRING,
                      description: 'Cost estimate including currency symbol, or "Free", based on the user budget.',
                    },
                    tips: {
                      type: SchemaType.STRING,
                      description: 'A pro-tip for this activity (e.g., Book in advance, wear comfy shoes).',
                    },
                  },
                  required: ['time', 'title', 'description', 'location', 'category', 'estimatedCost'],
                },
              },
            },
            required: ['day', 'title', 'theme', 'dailySummary', 'activities'],
          },
        },
      },
      required: ['tripSummary', 'days'],
    };
  }

  /**
   * Generates an itinerary based on user parameters.
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
    // Simulate a 3-second network delay for the MVP realism
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Return a beautifully detailed, hardcoded 3-day Paris itinerary
    return {
      tripSummary: "A magical 3-day journey through the heart of Paris, blending iconic landmarks, exquisite culinary experiences, and charming neighborhood strolls.",
      days: [
        {
          day: 1,
          title: "Icons & Elegance",
          theme: "Sightseeing & Classic Paris",
          dailySummary: "Start your trip with the absolute must-sees: the Eiffel Tower, the Seine, and a classic bistro dinner.",
          activities: [
            {
              time: "09:00 AM",
              title: "Eiffel Tower Ascent",
              description: "Take the elevator to the summit of the iconic Eiffel Tower for panoramic views of the city.",
              location: "Champ de Mars, 5 Ave Anatole France",
              category: "sightseeing",
              estimatedCost: "€28",
              tips: "Book tickets online weeks in advance to skip the massive queues!"
            },
            {
              time: "01:00 PM",
              title: "Lunch at Café de l'Homme",
              description: "Enjoy classic French cuisine with an unbeatable, direct view of the Eiffel Tower.",
              location: "17 Pl. du Trocadéro",
              category: "food",
              estimatedCost: "€45"
            },
            {
              time: "03:30 PM",
              title: "Seine River Cruise",
              description: "A relaxing one-hour boat cruise along the Seine, passing landmarks like Notre-Dame and the Louvre.",
              location: "Port de la Bourdonnais",
              category: "transport",
              estimatedCost: "€15"
            }
          ]
        },
        {
          day: 2,
          title: "Art & Bohemian Streets",
          theme: "Culture & History",
          dailySummary: "Dive into world-class art in the morning, followed by a wander through the artistic Montmartre district.",
          activities: [
            {
              time: "09:30 AM",
              title: "The Louvre Museum",
              description: "Explore the world's largest art museum. Marvel at the Mona Lisa, Venus de Milo, and the Winged Victory.",
              location: "Rue de Rivoli",
              category: "culture",
              estimatedCost: "€17",
              tips: "Use the Carrousel du Louvre underground entrance to avoid the main pyramid lines."
            },
            {
              time: "02:00 PM",
              title: "Wander Montmartre",
              description: "Walk the hilly, cobblestone streets of Montmartre, once home to Picasso and Van Gogh. Visit the Sacré-Cœur Basilica.",
              location: "Montmartre, 18th Arrondissement",
              category: "sightseeing",
              estimatedCost: "Free"
            },
            {
              time: "07:30 PM",
              title: "Dinner at Le Moulin de la Galette",
              description: "Dine in a historic windmill that has been serving Parisians for over a century.",
              location: "83 Rue Lepic",
              category: "food",
              estimatedCost: "€60"
            }
          ]
        },
        {
          day: 3,
          title: "Palaces & Patisseries",
          theme: "Indulgence & Architecture",
          dailySummary: "A half-day trip to Versailles followed by an afternoon of shopping and eating delicate pastries.",
          activities: [
            {
              time: "08:30 AM",
              title: "Palace of Versailles",
              description: "Take the RER train to Versailles to explore the opulent palace and its massive, manicured gardens.",
              location: "Place d'Armes, Versailles",
              category: "culture",
              estimatedCost: "€20",
              tips: "The gardens are free on most days, but you must pay on fountain show days."
            },
            {
              time: "03:00 PM",
              title: "Champs-Élysées & Arc de Triomphe",
              description: "Stroll down the famous avenue and climb the Arc de Triomphe for a final incredible city view.",
              location: "Place Charles de Gaulle",
              category: "sightseeing",
              estimatedCost: "€13"
            },
            {
              time: "05:00 PM",
              title: "Macarons at Ladurée",
              description: "Treat yourself to world-famous macarons in a stunning, ornate tea room.",
              location: "75 Av. des Champs-Élysées",
              category: "food",
              estimatedCost: "€15",
              tips: "The pistachio and rose petal flavors are legendary."
            }
          ]
        }
      ],
      rawText: "Mocked MVP response."
    };
  }
}

module.exports = new GeminiService();
