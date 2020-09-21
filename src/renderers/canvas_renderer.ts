import { CAMERA_HEIGHT, CAMERA_WIDTH } from "../camera";

export const addView = () => {
  const canvas = document.createElement("canvas");
  canvas.style.zIndex = "2";
  canvas.style.position = "absolute";
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;

  return canvas;
};

export const convertImportsToImages = (
  imageNames: string[]
): HTMLImageElement[] => {
  return imageNames.map((imageName) => {
    const image = new Image();
    image.src = imageName;
    return image;
  });
};
