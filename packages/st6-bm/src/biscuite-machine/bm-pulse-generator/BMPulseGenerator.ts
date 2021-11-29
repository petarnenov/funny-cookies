import EventEmitter from "events";
import { BMOperationEvent, BMUnit, BMUnitState } from "../abstract/BMUnit";

export class BMPulseGenerator extends BMUnit {
  pulser: NodeJS.Timer | null = null;
  constructor(bmEventEmitter: EventEmitter) {
    super(bmEventEmitter);
    this.start();
  }

  prepareToStart(cb?: CallableFunction): Promise<BMUnitState> {
    this.state = "preparing";
    let pulseId: number = 0;

    return new Promise((resolve, reject) => {
      if (this.initStatus) return resolve("ready");
      if (this.pulser) return;
      this.pulser = setInterval(() => {
        this.communicationManager.publish("pulse-on", {
          pulseId: ++pulseId,
        });
        //console.log("pilseId: ", pulseId);
      }, 500);
      resolve("ready");
      this.initStatus = true;
    });
  }

  prepareToStop(cb?: CallableFunction): Promise<BMUnitState> {
    return new Promise((resolve, reject) => {
      resolve("off");
    });
  }

  prepareToPause(cb?: CallableFunction): Promise<BMUnitState> {
    return new Promise((resolve, reject) => {
      resolve("off");
    });
  }

  handleTurnOn(ev: BMOperationEvent, cb?: CallableFunction): void {
    this.currentCommand = "turn-on";
  }
  handleTurnOff(ev: BMOperationEvent, cb?: CallableFunction): void {
    this.currentCommand = "turn-off";
  }
  handleTurnPause(ev: BMOperationEvent, cb?: CallableFunction): void {
    this.currentCommand = "turn-pause";
  }
  handlePulse(ev: BMOperationEvent, cb?: CallableFunction): void {}

  async start() {
    this.state = "on";
    this.state = await this.prepareToStart();
    this.communicationManager.publish("pulse-on");
  }

  stop() {}

  pause() {}
}
