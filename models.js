// models.js
require('dotenv').config();
const axios = require('axios');

async function checkGroqModels() {
  try {
    const response = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
    });
    
    console.log("\n🟢 Your API Key has access to these models:");
    response.data.data.forEach(model => console.log(`- ${model.id}`));
    console.log("\nCopy the shortest ID from this list and paste it into your gemma.js file.");
  } catch (error) {
    console.error("\n❌ API Error:", error.response?.data || error.message);
  }
}

checkGroqModels();