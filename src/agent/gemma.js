// src/agent/gemma.js
require('dotenv').config();
const axios = require('axios');
const { tools } = require('../tools/registry');

async function askJarvis(userPrompt) {
  const mode = process.env.LLM_MODE || 'local';
  
  // Dynamic Configuration
  const isOnline = mode === 'online';
  const endpoint = isOnline ? 'https://api.groq.com/openai/v1/chat/completions' : process.env.LOCAL_API_URL;
  const targetModel = isOnline ? 'openai/gpt-oss-120b' : 'gemma-4-e2b';
  
  const headers = {
    'Content-Type': 'application/json',
    ...(isOnline && { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` })
  };

  try {
    const response = await axios.post(endpoint, {
      model: targetModel,
      messages: [
        { 
          role: "system", 
          content: "You are JARVIS. You control a physical room. If the user asks to change a device, use the toggle_relay tool. Keep responses concise." 
        },
        { role: "user", content: userPrompt }
      ],
      tools: tools,
      tool_choice: "auto",
      temperature: 0.1 
    }, { headers });

    const responseMessage = response.data.choices[0].message;

    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      
      console.log(`\n🧠 [${mode.toUpperCase()}] JARVIS triggered: ${toolCall.function.name}`);
      return { type: 'tool', data: args };
    }

    console.log(`\n💬 [${mode.toUpperCase()}] JARVIS says: ${responseMessage.content}`);
    return { type: 'text', data: responseMessage.content };

  } catch (error) {
    console.error(`\n❌ Failed in ${mode} mode. Error:`, error.response?.data || error.message);
    return { type: 'text', data: "System failure. Unable to reach the processing core." };
  }
}

module.exports = { askJarvis };