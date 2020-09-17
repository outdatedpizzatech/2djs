import { Player } from "./player";
import { Camera } from "./camera";
import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  FRAMERATE,
  GRID_INTERVAL,
} from "./common";
import { fromEvent, interval, Observable, range } from "rxjs";
import { filter } from "rxjs/operators";

function index() {
  let inputDirections: Set<Direction> = new Set<Direction>();
  const camera = new Camera();

  function handlePlayerMovement(player: Player) {
    if (inputDirections.size > 0) {
      const direction = Array.from(inputDirections.entries())[0][0];
      player.moveBy(direction);
    }

    player.refreshMovement();
  }

  function handleRendering(player: Player, treasure: Player) {
    camera.setPosition(player.positionX(), player.positionY());
    player.render(camera);
    treasure.render(camera);
  }

  var body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = "black";
  var gameArea = document.createElement("div");
  gameArea.style.width = `${CAMERA_WIDTH}px`;
  gameArea.style.height = `${CAMERA_HEIGHT}px`;
  gameArea.style.marginLeft = "auto";
  gameArea.style.marginRight = "auto";
  body.appendChild(gameArea);
  var canvas = document.createElement("canvas");
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;
  canvas.style.zIndex = "1";
  canvas.style.position = "absolute";
  gameArea.appendChild(canvas);
  var ctx = canvas.getContext("2d");
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

  const player = new Player({
    color: "red",
    x: 0,
    y: 0,
    icon: "star",
  });
  gameArea.appendChild(player.view());

  const treasure = new Player({
    color: "blue",
    x: 192,
    y: 64,
    icon: "heart",
  });
  gameArea.appendChild(treasure.view());

  const keydown$ = fromEvent(document, "keydown");
  const keyup$ = fromEvent(document, "keyup");

  keydown$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowUp"))
    .subscribe(() => inputDirections.add(Direction.UP));

  keydown$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowRight"))
    .subscribe(() => inputDirections.add(Direction.RIGHT));

  keydown$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowDown"))
    .subscribe(() => inputDirections.add(Direction.DOWN));

  keydown$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowLeft"))
    .subscribe(() => inputDirections.add(Direction.LEFT));

  keyup$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowUp"))
    .subscribe(() => inputDirections.delete(Direction.UP));

  keyup$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowRight"))
    .subscribe(() => inputDirections.delete(Direction.RIGHT));

  keyup$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowDown"))
    .subscribe(() => inputDirections.delete(Direction.DOWN));

  keyup$
    .pipe(filter<KeyboardEvent>((x) => x.code == "ArrowLeft"))
    .subscribe(() => inputDirections.delete(Direction.LEFT));

  const frame$ = interval(1000 / FRAMERATE);

  frame$.subscribe(() => {
    handlePlayerMovement(player);
    handleRendering(player, treasure);
  });
}

index();
