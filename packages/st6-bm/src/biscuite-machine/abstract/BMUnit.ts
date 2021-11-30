import EventEmitter from "events";
import { BMProduct } from "../bm-product/BMProduct";

export abstract class BMUnit {
  communicationManager: CommunicationManager;
  startDependacies: BMUnit[] = [];
  pauseDependacies: BMUnit[] = [];
  stopDependacies: BMUnit[] = [];
  operations: { action: BMAction; slots: BMSlot[] }[] = [];
  state: BMUnitState = "off";
  initStatus: boolean = false;
  currentCommand: BMSwitchAction = "turn-off";
  abstract prepareToStart(cb?: CallableFunction): Promise<BMUnitState>;
  abstract prepareToStop(cb?: CallableFunction): Promise<BMUnitState>;
  abstract prepareToPause(cb?: CallableFunction): Promise<BMUnitState>;
  abstract handleTurnOn(ev: BMOperationEvent, cb?: CallableFunction): void;
  abstract handleTurnOff(ev: BMOperationEvent, cb?: CallableFunction): void;
  abstract handleTurnPause(ev: BMOperationEvent, cb?: CallableFunction): void;
  abstract handlePulse(ev: BMOperationEvent, cb?: CallableFunction): void;
  abstract start(cb?: CallableFunction): void;
  abstract pause(cb?: CallableFunction): void;
  abstract stop(cb?: CallableFunction): void;
  constructor(bmEventEmitter: EventEmitter) {
    this.communicationManager = new CommunicationManager(bmEventEmitter);
    this.communicationManager.subscribe(
      "turn-on",
      this.handleTurnOn.bind(this)
    );
    this.communicationManager.subscribe(
      "turn-off",
      this.handleTurnOff.bind(this)
    );
    this.communicationManager.subscribe(
      "turn-pause",
      this.handleTurnPause.bind(this)
    );
    this.communicationManager.subscribe(
      "pulse-on",
      this.handlePulse.bind(this)
    );
  }
  checkStartDependencies(): boolean {
    if (!this.startDependacies.length) return true;
    return this.startDependacies.every(
      (dependency) =>
        dependency.state === "ready" && dependency.checkStartDependencies()
    );
  }
  checkStopDependencies(): boolean {
    if (!this.stopDependacies.length) return true;
    return this.stopDependacies.every(
      (dependency) =>
        dependency.state === "off" && dependency.checkStopDependencies()
    );
  }

  emitOperations() {
    this.operations.forEach((operation) => {
      this.communicationManager.publish(operation.action, {
        action: operation.action,
        slots: operation.slots,
      });
    });
  }

  hasReady() {
    return this.state === "ready" && this.checkStartDependencies();
  }

  canStop() {
    return this.checkStopDependencies();
  }
}

class CommunicationManager {
  emitter: EventEmitter | null = null;
  constructor(bmEventEmitter: EventEmitter) {
    this.emitter = bmEventEmitter;
  }
  subscribe(message: BMAction, cb: BMEventHandler) {
    this.emitter?.on(message, cb);
  }
  publish(
    message: BMAction,
    payload: BMOperationEvent | BMPulseEvent | BMProductEvent | null = null
  ) {
    this.emitter?.emit(message, payload);
  }
}

export type BMAction = BMUnitAction | BMProductAction;

export type BMSwitchAction = "turn-on" | "turn-pause" | "turn-off";
export type BMPulseAction = "pulse-on" | "pulse-pause" | "pulse-off";
export type BMMotorAcction =
  | "motor-on"
  | "motor-pause"
  | "motor-off"
  | "motor-step";
export type BMConveyorAction =
  | "conveyor-load"
  | "conveyor-unload"
  | "conveyor-empty"
  | "conveyor-on"
  | "conveyor-pause"
  | "conveyor-off"
  | "conveyor-product-ready";
export type BMExtruderAction =
  | "extruder-extrude"
  | "extruder-on"
  | "extruder-pause"
  | "extruder-off";
export type BMStamperAction =
  | "stamper-stamp"
  | "stamper-on"
  | "stamper-pause"
  | "stamper-off";
export type BMOvenAction = "oven-heat" | "oven-on" | "oven-pause" | "oven-off";

export type BMUnitAction =
  | BMSwitchAction
  | BMPulseAction
  | BMMotorAcction
  | BMConveyorAction
  | BMExtruderAction
  | BMStamperAction
  | BMOvenAction;

export type BMProductAction = BMExtruderAction | BMStamperAction | BMOvenAction;

export type BMSlot = number;

export type BMUnitState = "on" | "preparing" | "ready" | "failure" | "off";

export interface BMOperationEvent {
  action: BMAction;
  slots: number[];
}

export interface BMPulseEvent {
  pulseId: number;
}

export interface BMProductEvent {
  product: BMProduct;
}

export type BMEventHandler = (
  e: BMOperationEvent,
  cb?: CallableFunction
) => void;
