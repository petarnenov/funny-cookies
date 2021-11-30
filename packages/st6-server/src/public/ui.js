export const startBtn = document.querySelector("#btn-start");
export const pauseBtn = document.querySelector("#btn-pause");
export const stopBtn = document.querySelector("#btn-stop");

startBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/start");
});

pauseBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/pause");
});

stopBtn.addEventListener("click", (e) => {
  fetch("http://localhost:3333/stop");
});
