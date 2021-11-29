export type BMOvenState = "oven-on" | "oven-off" | "oven-ready";

/* BMSwitch */
export type BMSwitchState = "switch-on" | "switch-pause" | "switch-off";
export type BMSwitchCommand =
  | "switch-turn-on"
  | "switch-turn-pause"
  | "switch-turn-off";
/* */

export type BMPulseGeneratorState = "pulse-on" | "pulse-off";
export type BMExtruderState =
  | "extruder-on"
  | "extruder-off"
  | "extruder-extrude";
export type BMStamperState = "stamper-on" | "stamper-off" | "stamper-stamp";
export type BMConveyorState = "conveyor-on" | "conveyor-off";

/* BMMotor */
export type BMMotorState = "motor-on" | "motor-off" | "motor-ready";
export type BMMotorCommand =
  | "motor-turn-on"
  | "motor-turn-off"
  | "motor-turn-drives";
/* */

/* BMCommandUnit */
export type BMCommandUnitState =
  | "command-unit-on"
  | "command-unit-off"
  | "command-unit-pause";
export type BMCommandUnitCommand =
  | "command-unit-turn-on"
  | "command-unit-turn-off"
  | "command-unit-turn-pause"
  | "command-unit-prepare-to-start"
  | "command-unit-response"
  | "command-unit-request";
/* */

export interface BMCommandUnitRequest {
  command: "prepare" | "pulse";
}

export interface BMCommandUnitResponse {
  command: "prepare";
  subject: "motor" | "switch" | "belt";
  state: "success" | "failure";
}

/* */

export type BMCommands =
  | BMOvenState
  | BMPulseGeneratorState
  | BMExtruderState
  | BMStamperState
  | BMConveyorState
  | BMMotorCommand
  | BMSwitchCommand
  | BMCommandUnitCommand;

export interface BMState {
  oven: BMOvenState;
  switch: BMSwitchState;
  pulser: BMPulseGeneratorState;
  extruder: BMExtruderState;
  stamper: BMStamperState;
  conveyor: BMConveyorState;
  motor: BMMotorState;
  commandUnit: BMCommandUnitState;
}

export interface BMOvenConfig {
  maxWorkingTemp: number;
  minWorkingTemp: number;
  heatByPulse: number;
  coldByBulse: number;
}

export interface BMConfig {
  oven: BMOvenConfig;
}

export type BMBiscuiteState =
  | "biscuite-extruded"
  | "biscuite-stamped"
  | "biscuite-pre-oven"
  | "biscuite-oven-half"
  | "biscuite-oven-second"
  | "biscuite-post-oven"
  | "biscuite-fall-down";
