import { BM } from "@pnp-js/st6-bm";
export const bm = new BM();

bm.eventBus.on("conveyor-product-ready", (e) => {
  console.log("conveyor-product-ready: ", e);
});
