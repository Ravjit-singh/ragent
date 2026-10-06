// src/tools/registry.js
const tools = [
  {
    type: "function",
    function: {
      name: "toggle_relay",
      description: "Turns a physical hardware device on or off via the ESP32 relay.",
      parameters: {
        type: "object",
        properties: {
          device: {
            type: "string",
            description: "The name of the device (e.g., 'fan', 'lights', 'heater')"
          },
          state: {
            type: "string",
            enum: ["ON", "OFF"],
            description: "The desired state to set the device to"
          }
        },
        required: ["device", "state"]
      }
    }
  }
];

module.exports = { tools };