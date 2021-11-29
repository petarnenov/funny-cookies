import EventEmitter from "events";
import {
  BMOperationEvent,
  BMEventHandler,
  BMUnit,
  BMUnitState,
} from "../abstract/BMUnit";

export class BMExtruder extends BMUnit {
  constructor(bmEventEmitter: EventEmitter) {
    super(bmEventEmitter);
  }

  handleTurnOn(ev: BMOperationEvent, cb?: BMEventHandler) {
    this.currentCommand = "turn-on";

    this.state = "on";
    this.start();
  }
  handleTurnOff(ev: BMOperationEvent, cb?: BMEventHandler) {
    this.currentCommand = "turn-off";
  }
  handleTurnPause(ev: BMOperationEvent, cb?: BMEventHandler) {
    this.state = "off";
    this.currentCommand = "turn-pause";
  }

  handlePulse(ev: BMOperationEvent, cb?: BMEventHandler) {
    //console.log("extruder state: ", this.state);
    if (this.currentCommand === "turn-on") {
      if (this.hasReady()) {
        this.emitOperations();
      }
    }
    if (this.currentCommand === "turn-off") {
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

  async start() {
    this.state = await this.prepareToStart();
    this.communicationManager.publish("extruder-on");
  }

  async stop() {
    this.state = await this.prepareToStop();
    this.communicationManager.publish("extruder-off");
  }

  async pause() {
    this.state = await this.prepareToPause();
    this.communicationManager.publish("extruder-pause");
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
      resolve("off");
    });
  }
}
