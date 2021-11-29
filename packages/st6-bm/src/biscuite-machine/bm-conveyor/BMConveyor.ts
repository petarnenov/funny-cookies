import EventEmitter from "events";
import {
  BMOperationEvent,
  BMEventHandler,
  BMUnit,
  BMUnitState,
} from "../abstract/BMUnit";
import { BMBaseProduct, BMProduct } from "../bm-product/BMProduct";

export class BMConveyoer extends BMUnit {
  capacity: number = 6;
  productionOnBelt: (BMBaseProduct | null)[] = [...new Array(6)].map(
    (slot) => null
  );

  constructor(bmEventEmitter: EventEmitter) {
    super(bmEventEmitter);
  }

  handlePulse(ev: BMOperationEvent, cb?: BMEventHandler) {
    //console.log("conveyor state: ", this.state);
    if (this.currentCommand === "turn-on") {
      if (this.hasReady()) {
        this.emitOperations();
      }
    }
    if (this.currentCommand === "turn-off") {
      if (
        this.canStop() &&
        this.productionOnBelt.every((product) => product === null)
      ) {
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
      cb && cb();
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

  async start() {
    this.state = "on";
    this.state = await this.prepareToStart(
      this.postPrepareSubscribe.bind(this)
    );
    this.communicationManager.publish("conveyor-on");
  }

  async stop() {
    this.state = await this.prepareToStop();
    this.communicationManager.publish("conveyor-off");
  }

  async pause() {
    this.state = await this.prepareToPause();
    this.communicationManager.publish("conveyor-pause");
  }

  postPrepareSubscribe() {
    this.communicationManager.subscribe(
      "extruder-extrude",
      this.handleExtruderExtrude.bind(this)
    );
    this.communicationManager.subscribe(
      "stamper-stamp",
      this.handleStamperStamp.bind(this)
    );
    this.communicationManager.subscribe(
      "oven-heat",
      this.handleOvenHeat.bind(this)
    );
    this.communicationManager.subscribe(
      "conveyor-load",
      this.handleConveyorLoad.bind(this)
    );
    this.communicationManager.subscribe(
      "conveyor-unload",
      this.handleConveyorUnload.bind(this)
    );
  }

  handleExtruderExtrude(e: BMOperationEvent) {
    e.slots?.forEach((slot) => {
      const product = new BMProduct("biscuite");
      if (e.action === "extruder-extrude") {
        product.applyedActions.push(e.action);
        this.productionOnBelt[slot - 1] = product;
      }
    });
  }

  handleStamperStamp(e: BMOperationEvent) {
    e.slots?.forEach((slot) => {
      if (this.productionOnBelt[slot - 1] && e.action === "stamper-stamp") {
        this.productionOnBelt[slot - 1]?.applyedActions.push(e.action);
      }
    });
  }

  handleOvenHeat(e: BMOperationEvent) {
    e.slots?.forEach((slot) => {
      if (this.productionOnBelt[slot - 1] && e.action === "oven-heat") {
        this.productionOnBelt[slot - 1]?.applyedActions.push(e.action);
      }
    });
  }

  handleConveyorLoad(e: BMOperationEvent) {
    e.slots?.forEach((slot) => {
      this.productionOnBelt.splice(slot - 1, 0, null);
    });
  }

  handleConveyorUnload(e: BMOperationEvent) {
    e.slots?.forEach((slot) => {
      const productionUnload = this.productionOnBelt.splice(slot, 1);
      this.communicationManager.publish("conveyor-product-ready", {
        product: productionUnload?.[0]!,
      });
      //console.log("product unload: ", this.productionOnBelt);
    });
  }
}
