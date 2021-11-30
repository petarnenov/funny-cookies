const startBtn = document.querySelector("#btn-start");
const pauseBtn = document.querySelector("#btn-pause");
const stopBtn = document.querySelector("#btn-stop");

const motor = document.querySelector("#motor");
const extruder = document.querySelector("#extruder");
const stamper = document.querySelector("#stamper");
const bExtruded = document.querySelector("#b-extruded");
const bStampedFirst = document.querySelector("#b-stamped-1");
const bStampedSecond = document.querySelector("#b-stamped-2");
const bBackedFirst = document.querySelector("#b-backed-1");
const bBackedSecond = document.querySelector("#b-backed-2");
const bBackedThird = document.querySelector("#b-backed-3");

const ws = new WebSocket("ws://localhost:3333");

ws.onopen = (ev) => {
  console.log(ev);
};
ws.onmessage = (ev) => {
  console.log(ev);
  const data = JSON.parse(ev.data);
  const type = data?.type;
  console.log(data?.type, data?.payload);
  if (type) {
    switch (type) {
      case "motor-step": {
        gsap.to(motor, { rotation: "+=32", duration: 0.1 });
        break;
      }
      case "extruder-extrude": {
        gsap
          .timeline()
          .to(extruder, { y: +36, duration: 0.1 })
          .to(extruder, { y: 0, duration: 0.1 });
        gsap.to(bExtruded, { opacity: 1, durartion: 0.05 });
        break;
      }
      case "stamper-stamp": {
        gsap
          .timeline()
          .to(stamper, { y: +8, duration: 0.1 })
          .to(stamper, { y: 0, duration: 0.1 });
        break;
      }
      case "conveyor-load": {
        gsap
          .timeline()
          .to(bExtruded, { opacity: 0, x: 64, duration: 0.1 })
          .to(bExtruded, { x: 0, duration: 0.1 });
        gsap
          .timeline()
          .to(bStampedFirst, { x: 64, duration: 0.1 })
          .to(bStampedFirst, { x: 0, duration: 0.1 });
        gsap
          .timeline()
          .to(bStampedSecond, { x: 64, duration: 0.1 })
          .to(bStampedSecond, { x: 0, duration: 0.1 });
        gsap
          .timeline()
          .to(bBackedFirst, { x: 64, duration: 0.1 })
          .to(bBackedFirst, { x: 0, duration: 0.1 });
        gsap
          .timeline()
          .to(bBackedSecond, { x: 64, duration: 0.1 })
          .to(bBackedSecond, { x: 0, duration: 0.1 });
        gsap
          .timeline()
          .to(bBackedThird, { x: 64, duration: 0.1 })
          .to(bBackedThird, { x: 0, duration: 0.1 });
        break;
      }
      case "stamper-stamp": {
        gsap.to(bExtruded, { opacity: 0, duration: 0.1 });
        gsap.to(bStampedFirst, { opacity: 1, durartion: 0.05 });
        break;
      }
      default: {
        break;
      }
    }
  }
};

startBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/start");
});

pauseBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/pause");
});

stopBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/stop");
});
