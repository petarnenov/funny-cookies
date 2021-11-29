import { BMProductAction } from "../abstract/BMUnit";

export interface BMBaseProduct {
  id: string;
  serialNumber: number;
  applyedActions: BMProductAction[];
}

export class BMProduct implements BMBaseProduct {
  static counter = 1;
  id: string;
  serialNumber: number;
  applyedActions: BMProductAction[];

  constructor(id: string) {
    this.id = id;
    this.serialNumber = BMProduct.counter++;
    this.applyedActions = [];
  }
}
