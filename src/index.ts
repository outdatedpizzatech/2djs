import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  FRAMERATE,
  GRID_INTERVAL,
} from "./common";
import { BehaviorSubject, fromEvent, interval, merge } from "rxjs";
import { filter, map, scan, withLatestFrom } from "rxjs/operators";
import SpriteSheet from "./player_spritesheet.png";

interface Camera {
  x: number;
  y: number;
  offset: () => { x: number; y: number };
}

interface KeyMap {
  [key: string]: boolean;
}

interface Player {
  color: string;
  x: number;
  y: number;
  canvas: HTMLCanvasElement;
  movementDirection: Direction;
  facingDirection: Direction;
  positionX: number;
  positionY: number;
  animationIndex: number;
  movementSpeed: number;
}

interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
}

function index() {
  let canvas = document.createElement("canvas");
  canvas.style.zIndex = "2";
  canvas.style.position = "absolute";
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;

  const player: Player = {
    color: "red",
    x: 0,
    y: 0,
    movementDirection: Direction.NONE,
    facingDirection: Direction.DOWN,
    canvas,
    positionX: 0,
    positionY: 0,
    animationIndex: 0,
    movementSpeed: 1,
  };

  canvas = document.createElement("canvas");
  canvas.style.zIndex = "2";
  canvas.style.position = "absolute";
  canvas.width = CAMERA_WIDTH;
  canvas.height = CAMERA_HEIGHT;

  const otherPlayer: Player = {
    color: "blue",
    x: 192,
    y: 64,
    movementDirection: Direction.NONE,
    facingDirection: Direction.DOWN,
    canvas,
    positionX: 192,
    positionY: 64,
    animationIndex: 0,
    movementSpeed: 1,
  };

  const camera = {
    x: 0,
    y: 0,
    offset: function () {
      return {
        x: CAMERA_WIDTH / 2 - this.x,
        y: CAMERA_HEIGHT / 2 - this.y,
      };
    },
  };

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
    const currentAnimation = _decideCurrentAnimation(gameState.player);
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

  function nextAnimationFrame(
    currentAnimation: number[],
    animationIndex: number
  ): number {
    if (currentAnimation) {
      const nextAnimationIndex = animationIndex + 1;

      if (currentAnimation.length <= nextAnimationIndex) {
        return 0;
      } else {
        return nextAnimationIndex;
      }
    } else {
      return -1;
    }
  }

  function _getSpriteFrame(
    facingDirection: Direction,
    currentAnimation: number[],
    animationIndex: number
  ): number {
    if (currentAnimation) {
      return currentAnimation[animationIndex];
    }

    if (facingDirection == Direction.DOWN) {
      return 0;
    } else if (facingDirection == Direction.UP) {
      return 2;
    } else if (facingDirection == Direction.LEFT) {
      return 4;
    } else if (facingDirection == Direction.RIGHT) {
      return 6;
    }

    return 0;
  }

  function renderPlayer(targetPlayer: Player, camera: Camera) {
    const ctx = targetPlayer.canvas.getContext("2d");
    ctx.restore();

    const { x, y } = camera.offset();
    ctx.clearRect(0, 0, targetPlayer.canvas.width, targetPlayer.canvas.height);
    ctx.fillStyle = targetPlayer.color;
    ctx.fillRect(
      targetPlayer.positionX + x,
      targetPlayer.positionY + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );

    ctx.save();

    const currentAnimation = _decideCurrentAnimation(targetPlayer);
    const animationIndex = nextAnimationFrame(
      currentAnimation,
      targetPlayer.animationIndex
    );
    const frameIndex = _getSpriteFrame(
      targetPlayer.facingDirection,
      currentAnimation,
      animationIndex
    );

    ctx.beginPath();
    ctx.rect(
      targetPlayer.positionX + x,
      targetPlayer.positionY + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
    ctx.clip();

    var img = new Image();
    img.src = SpriteSheet;

    ctx.drawImage(
      img,
      targetPlayer.positionX + x - frameIndex * GRID_INTERVAL,
      targetPlayer.positionY + y
    );
  }

  function _decideCurrentAnimation(targetPlayer: Player): number[] {
    const walkingDownAnimation = [0, 1];
    const walkingUpAnimation = [2, 3];
    const walkingLeftAnimation = [4, 5];
    const walkingRightAnimation = [6, 7];
    const dilationBaseline = 6;

    const movementDirection = targetPlayer.movementDirection;

    const dilate = (timeline: number[], count: number) => {
      return timeline.reduce((accumulator, currentValue) => {
        const stretched = new Array(count).fill(currentValue);
        return accumulator.concat(stretched);
      }, []);
    };

    if (movementDirection == Direction.NONE) {
      return null;
    }

    let animation: number[];

    if (movementDirection == Direction.DOWN) {
      animation = walkingDownAnimation;
    } else if (movementDirection == Direction.UP) {
      animation = walkingUpAnimation;
    } else if (movementDirection == Direction.RIGHT) {
      animation = walkingRightAnimation;
    } else if (movementDirection == Direction.LEFT) {
      animation = walkingLeftAnimation;
    } else {
      animation = walkingDownAnimation;
    }

    return dilate(animation, dilationBaseline / targetPlayer.movementSpeed);
  }

  var body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = "black";
  var gameArea = document.createElement("div");
  gameArea.style.width = `${CAMERA_WIDTH}px`;
  gameArea.style.height = `${CAMERA_HEIGHT}px`;
  gameArea.style.marginLeft = "auto";
  gameArea.style.marginRight = "auto";
  body.appendChild(gameArea);
  canvas = document.createElement("canvas");
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

  gameArea.appendChild(player.canvas);

  gameArea.appendChild(otherPlayer.canvas);
}

index();
