## Cookies Project

### Description

This project contains two packages:

1.  st6-bm  
    Represent OOP model of Biscuite Machine conveyor, with predefined:

- Switch  
   emitted events: "turn-on" | "turn-pause" | "turn-off"
- Motor  
   emitted events: "motor-on" | "motor-step" | "motor-off"
- Conveyor  
   emmited events: "conveyor-on" | "conveyor-off" | "conveyor-load" | "convyeor-production-ready"
- Extruder - unlimitted biscuite material  
   emitted events: "extruder-on" | "extruder-off" | "extruder-extrude"
- Stamper  
   emitted events: "stamper-on" | "stamper-off" | "stamper-stamp"
- Oven - working temp 220-240  
   emitted events: "oven-on" | "oven-off" | "oven-heat"
- Product - biscuite

```javascript
    {
        id: 'biscuite',
        serialNumber: 123456789,
        applyedActions: [ 'extruder-extrude', 'stamper-stamp', 'oven-heat', 'oven-heat' ]
    }
```

2.  st6-server  
    Represent above model visual with simple express server.

### Usage

Requirements:  
pre installed [NODE.js](https://nodejs.dev/)

1.  Without cloning repo, run command

```bash
npx @pnp-js/st6-server
```

and open in browser [BiscuiteMachine](http://localhost:3333)

2. Import only @pnp-js/st6-bm

```bash
npm install @pnp-js/st6-bm
```

```javascript
const { BM } = require("@pnp-js/st6-bm");
const biscuiteMachine = new BM();
const eventBus = biscuiteMachine.eventBus;

//start Biscuite Machine, by emitting <turn-on> event
eventBus.emit("turn-on");

//subscribe to <conveyor-product-ready> event
eventBus.on("conveyor-product-ready", handleConveyorProductReady);

//subscribe to <oven-temp> event
eventBus.on("oven-temp", handleOvenTemp);

function handleConveyorProductReady(message) {
  const { product } = message;
  //here can use ready product
  console.log("manufactured product: ", product);
}

function handleOvenTemp(message) {
  const { temp } = message;
  //here can use oven temp
  console.log("oven-temp: ", temp);
}

//stop Biscuite Machine
setTimeout(() => {
  eventBus.emit("turn-off");
  setTimeout(() => {
    process.exit();
  }, 10000);
}, 60000);
```

3. Clone repo

Requirements:  
pre installed [Lerna](https://www.npmjs.com/package/lerna)   
```bash
npm install lerna -g
```  

```bash
git clone https://github.com/petarnenov/funny-cookies.git
cd funny-cookies
lerna init
lerna bootstrap
lerna link
```

-develop mode:

```bash
npm run debug
```
