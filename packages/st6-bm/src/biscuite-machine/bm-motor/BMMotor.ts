import EventEmitter from "events";
import {
  BMOperationEvent,
  BMEventHandler,
  BMUnit,
  BMUnitState,
} from "../abstract/BMUnit";

export class BMMotor extends BMUnit {
  constructor(bmEventEmitter: EventEmitter) {
    super(bmEventEmitter);
  }

  handlePulse(ev: BMOperationEvent, cb?: BMEventHandler) {
    //console.log("motor state: ", this.state);
    if (this.currentCommand === "turn-on") {
      if (this.hasReady()) {
        this.emitOperations();
      }
    }
    if (this.currentCommand === "turn-off") {
      if (this.state === "on") {
        this.state = "ready";
      }
      if (this.canStop()) {
        this.stop();
      } else {
        this.emitOperations();
      }
    }
    if (this.currentCommand === "turn-pause") {
      this.pause();
    }
  }

  handleTurnOn(ev: BMOperationEvent, cb?: BMEventHandler) {
    this.currentCommand = "turn-on";
    this.start();
  }

  handleTurnPause(ev: BMOperationEvent, cb?: BMEventHandler): void {
    this.currentCommand = "turn-pause";
  }

  handleTurnOff(ev: BMOperationEvent, cb?: BMEventHandler) {
    this.currentCommand = "turn-off";
  }

  prepareToStart(cb?: CallableFunction): Promise<BMUnitState> {
    this.state = "preparing";
    return new Promise((resolve, reject) => {
      if (this.initStatus) return resolve("ready");
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
      resolve("on");
    });
  }

  async start() {
    this.state = "on";
    this.state = await this.prepareToStart();
    this.communicationManager.publish("motor-on");
  }

  async stop() {
    this.state = await this.prepareToStop();
    this.communicationManager.publish("motor-off");
  }

  async pause() {
    this.state = await this.prepareToPause();
    this.communicationManager.publish("motor-pause");
  }
}
