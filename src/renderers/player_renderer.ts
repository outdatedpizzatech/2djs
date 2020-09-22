import { Camera } from "../camera";
import { GRID_INTERVAL } from "../common";
import {
  getAnimationFrames,
  nextAnimationFrame,
  Player,
} from "../models/player";
import { Direction } from "../direction";
import sprites from "../sprite_collections/player_sprite_collection";

export const renderPlayer = (
  targetPlayer: Player,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  const { debug, animationIndex, facingDirection } = targetPlayer;
  const { worldX, worldY } = camera.project(targetPlayer);

  if (debug.color) {
    ctx.fillStyle = debug.color;
    ctx.fillRect(worldX, worldY, GRID_INTERVAL, GRID_INTERVAL);
  }

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

  ctx.drawImage(sprites[frameIndex], worldX, worldY);
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
