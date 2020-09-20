import { Player } from "./player";
import { CAMERA_HEIGHT, CAMERA_WIDTH, GRID_INTERVAL } from "./common";
import { Tree } from "./tree";
import { debug } from "webpack";

interface RenderFixture {
  debugArea: CanvasRenderingContext2D;
}

export function renderGameSpace(
  players: Player[],
  trees: Tree[]
): RenderFixture {
  var body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = "black";
  var gameArea = document.createElement("div");
  gameArea.style.width = `${CAMERA_WIDTH}px`;
  gameArea.style.height = `${CAMERA_HEIGHT}px`;
  gameArea.style.marginLeft = "auto";
  gameArea.style.marginRight = "auto";
  body.appendChild(gameArea);
  const canvas = document.createElement("canvas");
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;
  canvas.style.zIndex = "1";
  canvas.style.position = "absolute";
  gameArea.appendChild(canvas);
  var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "green";
  for (var x = 0; x < 1000; x++) {
    for (var y = 0; y < 1000; y++) {
      ctx.fillRect(
        x * GRID_INTERVAL,
        y * GRID_INTERVAL,
        GRID_INTERVAL,
        GRID_INTERVAL
      );
    }
  }

  players.forEach((player) => {
    gameArea.appendChild(player.canvas);
  });

  trees.forEach((tree) => {
    gameArea.appendChild(tree.canvas);
  });

  const debugCanvas = document.createElement("canvas");
  debugCanvas.width = CAMERA_WIDTH;
  debugCanvas.height = CAMERA_HEIGHT;
  debugCanvas.style.zIndex = "10000";
  debugCanvas.style.position = "absolute";
  gameArea.appendChild(debugCanvas);

  return {
    debugArea: debugCanvas.getContext("2d") as CanvasRenderingContext2D,
  };
}
