import EventEmitter from "events";
import { BMConfig } from "../types";
import { BMUnit } from "./abstract/BMUnit";
import { BMConveyoer } from "./bm-conveyor/BMConveyor";

import { BMExtruder } from "./bm-extruder/BMExtruder";
import { BMMotor } from "./bm-motor/BMMotor";

import { BMOven } from "./bm-oven/BMOven";
import { BMPulseGenerator } from "./bm-pulse-generator/BMPulseGenerator";

import { BMStamper } from "./bm-stamper/BMStamper";
import { BMSwitch } from "./bm-switch/BNSwitch";

export class BM {
  private switch: BMUnit;
  private pulser: BMUnit;
  private oven: BMUnit;
  private motor: BMUnit;
  private conveyor: BMUnit;
  private extruder: BMUnit;
  private stamper: BMUnit;

  eventBus: EventEmitter;

  constructor() {
    this.eventBus = new EventEmitter();
    this.switch = new BMSwitch(this.eventBus);
    this.pulser = new BMPulseGenerator(this.eventBus);
    this.motor = new BMMotor(this.eventBus);
    this.conveyor = new BMConveyoer(this.eventBus);
    this.extruder = new BMExtruder(this.eventBus);
    this.stamper = new BMStamper(this.eventBus);
    this.oven = new BMOven(this.eventBus);
    this.init();
  }
  private init() {
    /* BMSwitch */
    /* */

    /* BMPulseGenerator */
    /* */

    /* BMMotor */
    this.motor.operations.push({ action: "motor-step", slots: [] });
    this.motor.startDependacies.push(this.oven);
    this.motor.stopDependacies.push(this.conveyor);
    /* */

    /* BMConveyor */
    this.conveyor.operations.push(
      { action: "conveyor-load", slots: [1] },
      { action: "conveyor-unload", slots: [6] }
    );
    this.conveyor.startDependacies.push(this.motor);
    /* */

    /* BMExtruder */
    this.extruder.operations.push({ action: "extruder-extrude", slots: [1] });
    this.extruder.startDependacies.push(this.conveyor);
    /* */

    /* BMStamper */
    this.stamper.operations.push({ action: "stamper-stamp", slots: [2] });
    this.stamper.startDependacies.push(this.conveyor, this.extruder);
    this.stamper.stopDependacies.push(this.extruder);
    /* */

    /* BMOven */
    this.oven.operations.push({ action: "oven-heat", slots: [4, 5] });
    this.oven.stopDependacies.push(this.conveyor);
    /* */
  }
  start() {
    this.switch.start();
  }
  pause() {
    this.switch.pause();
  }
  stop() {
    this.switch.stop();
  }
}
