import express from "express";
import cors from "cors";
import path from "path";
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
