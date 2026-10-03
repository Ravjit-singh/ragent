const say = require('say');

function speak(text) {
  return new Promise((resolve, reject) => {
    // You can replace 'null' with 'Microsoft David Desktop' or 'Microsoft Zira Desktop' 
    // to force a specific Windows voice, and adjust the 1.0 for speed.
    say.speak(text, null, 1.0, (err) => {
      if (err) {
        console.error("Speech error:", err);
        return resolve(); // Resolve anyway so the chat loop doesn't crash
      }
      resolve();
    });
  });
}

module.exports = { speak };