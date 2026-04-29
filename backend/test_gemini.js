const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const geminiService = require('./services/geminiService');

async function test() {
  try {
    console.log("Testing generation...");
    const res = await geminiService.generateItinerary({
      destination: "Paris",
      days: 3,
      budget: 1000,
      currency: "USD",
      budgetLevel: "moderate",
      preferences: ["Food"]
    });
    console.log("Success:", res.tripSummary);
  } catch (err) {
    console.error("Test Failed:");
    console.error(err.message);
  }
}
test();
