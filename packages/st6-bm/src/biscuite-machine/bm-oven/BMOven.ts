import EventEmitter from "events";
import {
  BMOperationEvent,
  BMEventHandler,
  BMUnit,
  BMUnitState,
} from "../abstract/BMUnit";

export class BMOven extends BMUnit {
  static readonly MIN_TEMP = 220;
  static readonly MAX_TEMP = 240;
  static readonly DECREASE_TEMP = 2;
  static readonly INCREASE_TEMP = 5;
  temp: number = 0;
  heating: boolean = false;
  constructor(bmEventEmitter: EventEmitter) {
    super(bmEventEmitter);
  }

  handleTurnOn(ev: BMOperationEvent, cb?: BMEventHandler): void {
    this.currentCommand = "turn-on";
    this.start();
  }
  handleTurnOff(ev: BMOperationEvent, cb?: BMEventHandler): void {
    this.currentCommand = "turn-off";
  }
  handleTurnPause(ev: BMOperationEvent, cb?: BMEventHandler): void {
    this.currentCommand = "turn-pause";
  }

  handlePulse(ev: BMOperationEvent, cb?: BMEventHandler): void {
    //console.log("oven state: ", this.state);
    this.communicationManager.publish("oven-temp", { temp: this.temp });
    if (
      this.currentCommand === "turn-on" ||
      this.currentCommand == "turn-pause"
    ) {
      if (this.heating) {
        this.temp += BMOven.INCREASE_TEMP;
      } else {
        if (this.temp > 0) this.temp -= BMOven.DECREASE_TEMP;
      }

      //console.log("current oven temp: ", this.temp);

      this.state = this.getCurrentState();

      if (this.hasReady()) {
        this.emitOperations();
      }
    }

    if (this.currentCommand === "turn-off") {
      if (this.canStop()) {
        if (this.temp > 0) this.temp -= BMOven.DECREASE_TEMP;
        this.stop();
      } else {
        this.emitOperations();
      }
    }
  }

  async start() {
    this.state = await this.prepareToStart();
    this.communicationManager.publish("oven-on");
  }
  async stop() {
    this.state = await this.prepareToStop();
    this.communicationManager.publish("oven-off");
  }

  async pause() {
    this.state = await this.prepareToPause();
    this.communicationManager.publish("oven-pause");
  }

  prepareToStart(cb?: CallableFunction): Promise<BMUnitState> {
    this.state = "preparing";
    return new Promise((resolve, reject) => {
      if (this.initStatus) return resolve(this.getCurrentState());
      resolve(this.getCurrentState());
      this.initStatus = true;
    });
  }

  prepareToStop(cb?: CallableFunction): Promise<BMUnitState> {
    return new Promise((resolve, reject) => {
      this.heating = false;
      resolve("off");
    });
  }

  prepareToPause(cb?: CallableFunction): Promise<BMUnitState> {
    return new Promise((resolve, reject) => {
      this.heating = false;
      resolve(this.getCurrentState());
    });
  }

  // TODO: check thi one
  getCurrentState() {
    let currentState: BMUnitState = "off";
    if (
      this.currentCommand === "turn-on" ||
      this.currentCommand === "turn-pause"
    ) {
      if (this.checkColdTemp()) {
        currentState = "on";
        this.heating = true;
      }
      if (this.checkOverHeatTemp()) {
        currentState = "ready";
        this.heating = false;
      }
      if (this.checkReadyTemp()) {
        currentState = "ready";
      }
    }
    if (this.currentCommand === "turn-off") {
      this.heating = false;
      currentState = "off";
    }
    return currentState;
  }

  checkReadyTemp() {
    return this.temp >= BMOven.MIN_TEMP && this.temp <= BMOven.MAX_TEMP;
  }
  checkColdTemp() {
    return this.temp < BMOven.MIN_TEMP + BMOven.DECREASE_TEMP;
  }
  checkOverHeatTemp() {
    return this.temp > BMOven.MAX_TEMP - BMOven.INCREASE_TEMP;
  }
}
