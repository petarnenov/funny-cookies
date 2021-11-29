import EventEmitter from "events";
import {
  BMOperationEvent,
  BMEventHandler,
  BMUnit,
  BMUnitState,
} from "../abstract/BMUnit";

export class BMSwitch extends BMUnit {
  constructor(bmEventEmitter: EventEmitter) {
    super(bmEventEmitter);
  }

  handleTurnOn(ev: BMOperationEvent, cb?: BMEventHandler): void {}
  handleTurnOff(ev: BMOperationEvent, cb?: BMEventHandler): void {}
  handleTurnPause(ev: BMOperationEvent, cb?: BMEventHandler): void {}
  handlePulse(ev: BMOperationEvent, cb?: BMEventHandler): void {
    //console.log("switch state: ", this.state);
  }

  prepareToStart(cb?: CallableFunction): Promise<BMUnitState> {
    return new Promise((resolve, reject) => {
      resolve("ready");
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

  async start() {
    this.state = "on";
    const state = await this.prepareToStart();
    this.state = state;
    this.communicationManager.publish("turn-on");
  }
  async pause() {
    this.state = await this.prepareToPause();
    this.communicationManager?.publish("turn-pause");
  }
  async stop() {
    this.state = await this.prepareToStop();
    this.communicationManager?.publish("turn-off");
  }
}
