import { Player } from "./player";
import { Camera } from "./camera";
import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  FRAMERATE,
  GRID_INTERVAL,
} from "./common";
import { fromEvent, interval, merge } from "rxjs";
import { scan, withLatestFrom } from "rxjs/operators";

function index() {
  const frame$ = interval(1000 / FRAMERATE);
  const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
  const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");
  const keyActions$ = merge(keydown$, keyup$);
  const keyMap$ = keyActions$.pipe(
    scan<KeyboardEvent, { [key: string]: boolean }>((acc, val) => {
      acc[val.code] = val.type == "keydown";
      return acc;
    }, {})
  );

  const keysMapPerFrame$ = frame$.pipe(withLatestFrom(keyMap$));

  const camera = new Camera();

  function handlePlayerMovement(
    player: Player,
    keymap: { [key: string]: boolean }
  ) {
    let direction = Direction.NONE;

    if (keymap["ArrowUp"]) {
      direction = Direction.UP;
    } else if (keymap["ArrowRight"]) {
      direction = Direction.RIGHT;
    } else if (keymap["ArrowDown"]) {
      direction = Direction.DOWN;
    } else if (keymap["ArrowLeft"]) {
      direction = Direction.LEFT;
    }

    if (direction != Direction.NONE) {
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

  keysMapPerFrame$.subscribe(([_frame, keyMap]) => {
    handlePlayerMovement(player, keyMap);
  });

  keyMap$.subscribe((keyMap) => console.log(keyMap));

  frame$.subscribe(() => {
    handleRendering(player, treasure);
  });
}

index();
