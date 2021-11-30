import { socketURL } from "./config.js";
import {
  handleExtruderExtrude,
  handleMotorStep,
  handleOvenHeat,
  handleOvenTemp,
  handleStamperStamp,
} from "./message-handlers.js";

export const ws = new WebSocket(socketURL);

ws.onopen = (ev) => {
  console.log("Connection opened");
};

ws.onmessage = (ev) => {
  try {
    const message = JSON.parse(ev.data);
    messageDispatcher(message);
  } catch (err) {
    console.error(err.message || JSON.stringify(err));
  }
};

ws.onerror = (ev) => {
  console.error(`error: ${ev}`);
};

ws.onclose = (ev) => {
  console.warn("Socket connection closed");
};

const messageDispatcher = (message) => {
  const { type, payload } = message;
  if (!type) return;
  switch (type) {
    case "motor-step": {
      handleMotorStep();
      break;
    }
    case "extruder-extrude": {
      handleExtruderExtrude();
      break;
    }
    case "stamper-stamp": {
      handleStamperStamp();
      break;
    }
    case "oven-heat": {
      handleOvenHeat();
      break;
    }
    case "oven-temp": {
      handleOvenTemp(payload);
      break;
    }
  }
};
