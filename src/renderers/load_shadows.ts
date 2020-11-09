import { shadowize } from "./filters/shadowize";

export const loadShadow = (sprite: HTMLImageElement) => {
  const tempContext = document
    .createElement("canvas")
    .getContext("2d") as CanvasRenderingContext2D;
  tempContext.drawImage(sprite, 0, 0);
  shadowize(tempContext);
  return tempContext.canvas;
};
