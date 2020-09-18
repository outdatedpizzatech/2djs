import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  FRAMERATE,
  GRID_INTERVAL,
} from "./common";
import { BehaviorSubject, fromEvent, interval, merge } from "rxjs";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { Camera, cameraFactory } from "./camera";
import {
  decideCurrentAnimation,
  nextAnimationFrame,
  Player,
  playerFactory,
  renderPlayer,
} from "./player";

interface KeyMap {
  [key: string]: boolean;
}

interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
}

function index() {
  const player: Player = playerFactory({
    color: "red",
    x: 0,
    y: 0,
  });

  const otherPlayer: Player = playerFactory({
    color: "blue",
    x: 192,
    y: 64,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  const gameState: GameState = {
    player,
    camera,
    otherPlayer,
  };

  const frame$ = interval(1000 / FRAMERATE);
  const keydown$ = fromEvent<KeyboardEvent>(document, "keydown");
  const keyup$ = fromEvent<KeyboardEvent>(document, "keyup");
  const keyActions$ = merge(keydown$, keyup$);
  const keyMap$ = keyActions$.pipe(
    scan<KeyboardEvent, KeyMap>((acc, val) => {
      acc[val.code] = val.type == "keydown";
      return acc;
    }, {})
  );

  const keysMapPerFrame$ = frame$.pipe(withLatestFrom(keyMap$));

  const directionForFrame$ = keysMapPerFrame$.pipe(
    map(([_, keymap]) => getDirectionFromKeyMap(keymap)),
    filter((direction) => direction != Direction.NONE)
  );

  const gameState$ = new BehaviorSubject(gameState);

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !gameState.player.movementDirection)
    )
    .subscribe(([direction, gameState]) => {
      gameState.player.facingDirection = direction;
      gameState.player.movementDirection = direction;

      gameState$.next(gameState);
    });

  frame$.pipe(withLatestFrom(gameState$)).subscribe(([_, gameState]) => {
    // move camera
    gameState.camera.x = gameState.player.positionX;
    gameState.camera.y = gameState.player.positionY;

    // render player
    renderPlayer(gameState.player, gameState.camera);
    renderPlayer(gameState.otherPlayer, gameState.camera);

    // animate player
    const currentAnimation = decideCurrentAnimation(gameState.player);
    const animationIndex = nextAnimationFrame(
      currentAnimation,
      gameState.player.animationIndex
    );
    gameState.player.animationIndex = animationIndex;

    gameState$.next(gameState);
  });

  frame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !!gameState.player.movementDirection)
    )
    .subscribe(([_, gameState]) => {
      if (gameState.player.movementDirection == Direction.UP) {
        gameState.player.positionY -= gameState.player.movementSpeed;

        if (gameState.player.positionY % GRID_INTERVAL === 0) {
          gameState.player.movementDirection = Direction.NONE;
        }
      }

      if (gameState.player.movementDirection == Direction.RIGHT) {
        gameState.player.positionX += gameState.player.movementSpeed;

        if (gameState.player.positionX % GRID_INTERVAL === 0) {
          gameState.player.movementDirection = Direction.NONE;
        }
      }

      if (gameState.player.movementDirection == Direction.DOWN) {
        gameState.player.positionY += gameState.player.movementSpeed;

        if (gameState.player.positionY % GRID_INTERVAL === 0) {
          gameState.player.movementDirection = Direction.NONE;
        }
      }

      if (gameState.player.movementDirection == Direction.LEFT) {
        gameState.player.positionX -= gameState.player.movementSpeed;

        if (gameState.player.positionX % GRID_INTERVAL === 0) {
          gameState.player.movementDirection = Direction.NONE;
        }
      }

      gameState$.next(gameState);
    });

  function getDirectionFromKeyMap(keymap: KeyMap): Direction {
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

    return direction;
  }

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

  gameArea.appendChild(player.canvas);

  gameArea.appendChild(otherPlayer.canvas);
}

index();
