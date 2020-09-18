import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
import {
  decideCurrentAnimation,
  nextAnimationFrame,
  Player,
  playerFactory,
  renderPlayer,
} from "./player";
import { directionForFrame$, frame$, gameState$ } from "./signals";
import { GameState } from "./game_state";

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

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
  };

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
    gameState.player.animationIndex = nextAnimationFrame(
      currentAnimation,
      gameState.player.animationIndex
    );

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

  gameState$.next(initialGameState);
}

index();
