// src/index.js
const readline = require('readline');
const { askJarvis } = require('./agent/gemma');
const { speak } = require('./agent/voice');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chatLoop() {
  rl.question('\n🎤 You: ', async (userInput) => {
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      console.log("Shutting down JARVIS...");
      await speak("Shutting down systems. Goodbye, Ravjit.");
      rl.close();
      return;
    }

    // Send input to the local Gemma model
    const response = await askJarvis(userInput);

    if (response.type === 'tool') {
      // Mock the ESP32 hardware execution since the board isn't plugged in yet
      const hardwareText = `Executing command. Setting ${response.data.device} to ${response.data.state}.`;
      console.log(`\n🤖 JARVIS (Hardware Triggered): ${hardwareText}`);
      await speak(hardwareText);
    } else {
      // Standard text conversation
      await speak(response.data);
    }

    // Recursively call the loop for continuous conversation
    chatLoop();
  });
}

console.log("JARVIS offline core initialized. Type 'exit' to quit.");
chatLoop();