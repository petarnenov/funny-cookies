import {
  extruder,
  motor,
  stamper,
  oven,
  ovenTemp,
  switchBtn,
} from "./machine-units.js";
import { production, slots } from "./config.js";

export const productionRoot = document.querySelector("#production");

export const handleMotorStep = () => {
  motor &&
    production.forEach((p) => {
      p && gsap.to(p, { x: "+=62", duration: 0.1 });
    });
  motor && gsap.to(motor, { rotation: "+=32", duration: 0.1 });
};

export const handleExtruderExtrude = () => {
  extruder &&
    gsap
      .timeline()
      .to(extruder, { y: +36, duration: 0.1 })
      .to(extruder, { y: 0, duration: 0.1 });

  const product = document.createElement("img");
  product.className = "production";
  product.style.left = slots[0].x;
  product.style.top = slots[0].y;
  product.src = slots[0].src;
  production[0] = product;
  productionRoot.insertBefore(product, productionRoot.firstChild);
};

export const handleStamperStamp = () => {
  stamper &&
    gsap
      .timeline()
      .to(stamper, { y: +8, duration: 0.1 })
      .to(stamper, { y: 0, duration: 0.1 });
  production[2 - 1] && (production[2 - 1].src = slots[2 - 1].src);
};

export const handleOvenHeat = () => {
  oven &&
    gsap
      .timeline()
      .to(oven, {
        y: +8,
        duration: 0.1,
        onStart: () => {
          oven.src = "./media/oven-heat.png";
        },
        onComplete: () => {
          oven.src = "./media/oven.png";
        },
      })
      .to(oven, { y: 0, duration: 0.1 });

  production[4 - 1] && (production[4 - 1].src = slots[4 - 1].src);
  production[5 - 1] && (production[5 - 1].src = slots[5 - 1].src);
};

export const handleOvenTemp = (payload) => {
  if (payload?.temp) {
    ovenTemp.textContent = `Temp: ${payload.temp}`;
  }
};

export const handleConveyorUnload = () => {
  let readyProduct = production.pop();
  readyProduct &&
    gsap.to(readyProduct, {
      rotation: 720,
      duration: 0.2,
      onComplete: () => {
        readyProduct && productionRoot.removeChild(readyProduct);
        readyProduct = null;
      },
    });
  if (production.length < 6) production.unshift(null);
};

export const handleSwitchOn = () => {
  switchBtn.src = "./media/switch-on.png";
};

export const handleSwitchPause = () => {
  switchBtn.src = "./media/switch-pause.png";
};

export const handleSwitchOff = () => {
  switchBtn.src = "./media/switch-off.png";
};

export const handleConveyorProductReady = (payload) => {
  console.log("product ready: ", payload);
};
