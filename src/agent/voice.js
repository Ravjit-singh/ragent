// src/agent/voice.js
const { spawn } = require('child_process');
const sound = require('sound-play');
const path = require('path');
const fs = require('fs');

async function speak(text) {
  return new Promise((resolve) => {
    // Strip emojis and special characters that confuse the TTS engine
    const cleanText = text.replace(/[^a-zA-Z0-9.,?!' ]/g, '');
    
    // Define exact paths based on our folder structure
    const dataDir = path.join(__dirname, '../../data');
    const wavFile = path.join(dataDir, 'reply.wav');
    const piperPath = path.join(__dirname, '../../piper/piper.exe');
    const modelPath = path.join(__dirname, '../../piper/voice.onnx');

    // Ensure the data directory exists for the audio output
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Spawn the local Piper process
    const piper = spawn(piperPath, [
      '--model', modelPath,
       '--output_file', wavFile,
       '--length_scale', '1.15'
      ]);

    // Stream the text to Piper
    piper.stdin.write(cleanText);
    piper.stdin.end();

    // When Piper finishes generating the audio, play it
    piper.on('close', async (code) => {
      if (code !== 0) {
        console.error("Piper TTS failed. Check if the model files are in the piper/ folder.");
        return resolve();
      }

      try {
        await sound.play(wavFile);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
      resolve();
    });
  });
}

module.exports = { speak };