import express from "express";
import cors from "cors";
import path from "path";
import { WebSocket, WebSocketServer } from "ws";
import { bm } from "./machine";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/media")));

app.get("/start", (req, res) => {
  bm.eventBus.emit("turn-on");
  res.send("Start");
});

app.get("/pause", (req, res) => {
  bm.eventBus.emit("turn-pause");
  res.send("Pause");
});

app.get("/stop", (req, res) => {
  bm.eventBus.emit("turn-off");
  res.send("Stop");
});

const server = app.listen(3333, () => {
  "Server start listenig on port: 3333";
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  //ws.send("Hi there, I am a WebSocket server");

  bm.eventBus.on("motor-step", (ev) => {
    ws.send(JSON.stringify({ type: "motor-step" }));
  });
  bm.eventBus.on("extruder-extrude", (ev) => {
    ws.send(JSON.stringify({ type: "extruder-extrude" }));
  });
  bm.eventBus.on("stamper-stamp", (ev) => {
    ws.send(JSON.stringify({ type: "stamper-stamp" }));
  });
  bm.eventBus.on("conveyor-load", (ev) => {
    ws.send(JSON.stringify({ type: "conveyor-load" }));
  });
  bm.eventBus.on("conveyor-unload", (ev) => {
    ws.send(JSON.stringify({ type: "conveyor-unload" }));
  });
  bm.eventBus.on("stamper-stamp", (ev) => {
    ws.send(JSON.stringify({ type: "stamper-stamp" }));
  });
  bm.eventBus.on("oven-heat", (ev) => {
    ws.send(JSON.stringify({ type: "oven-heat" }));
  });
  bm.eventBus.on("oven-temp", (ev) => {
    ws.send(JSON.stringify({ type: "oven-temp", payload: ev }));
  });
  bm.eventBus.on("turn-on", (ev) => {
    ws.send(JSON.stringify({ type: "switch-on" }));
  });
  bm.eventBus.on("turn-pause", (ev) => {
    ws.send(JSON.stringify({ type: "switch-pause" }));
  });
  bm.eventBus.on("turn-off", (ev) => {
    ws.send(JSON.stringify({ type: "switch-off" }));
  });
});
