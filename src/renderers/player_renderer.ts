import { Camera } from "../camera";
import { GRID_INTERVAL } from "../common";
import SpriteSheet from "../assets/player_spritesheet.png";
import { getAnimationFrames, nextAnimationFrame, Player } from "../player";
import { Direction } from "../direction";

export const renderPlayer = (targetPlayer: Player, camera: Camera) => {
  const {
    view,
    worldX,
    worldY,
    debug,
    animationIndex,
    facingDirection,
  } = targetPlayer;
  const ctx = view.getContext("2d") as CanvasRenderingContext2D;
  ctx.restore();

  const { worldX: cameraX, worldY: cameraY } = camera.offset();

  ctx.clearRect(0, 0, view.width, view.height);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(
      worldX + cameraX,
      worldY + cameraY,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }

  ctx.save();

  const currentAnimation = getAnimationFrames(targetPlayer);
  const newAnimationIndex = nextAnimationFrame(
    currentAnimation,
    animationIndex
  );
  const frameIndex = _getSpriteFrame(
    facingDirection,
    currentAnimation,
    newAnimationIndex
  );

  ctx.beginPath();
  ctx.rect(worldX + cameraX, worldY + cameraY, GRID_INTERVAL, GRID_INTERVAL);
  ctx.clip();

  const img = new Image();
  img.src = SpriteSheet;

  ctx.drawImage(
    img,
    worldX + cameraX - frameIndex * GRID_INTERVAL,
    worldY + cameraY
  );
};

function _getSpriteFrame(
  facingDirection: Direction,
  currentAnimation: number[] | null,
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
