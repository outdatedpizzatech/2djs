export const shadowize = (context: CanvasRenderingContext2D) => {
  const treeImgData = context.getImageData(
    0,
    0,
    context.canvas.width,
    context.canvas.height
  );
  var pixels = treeImgData.data;
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    pixels[i] = 0; // red
    pixels[i + 1] = 0; // green
    pixels[i + 2] = 0; // blue

    // alpha
    if (pixels[i + 3] == 255) {
      pixels[i + 3] = 100;
    } else {
      pixels[i + 3] = 0;
    }
  }
  context.putImageData(treeImgData, 0, 0);
};
