import { Camera, project } from "../../camera";
import { GRID_INTERVAL } from "../../common";
import {
  getAnimationFrames,
  Player,
  walkingDownAnimation,
  walkingUpAnimation,
} from "../../models/player";
import { Direction } from "../../direction";
import sprites from "../../sprite_collections/player_sprite_collection";
import { LayerMaps } from "../../coordinate_map";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderPlayer = (
  model: Player,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const { facingDirection } = model;

  const currentAnimation = getAnimationFrames(model);
  const animationIndex = _getAnimationIndex(currentAnimation, model);
  const frameIndex = _getSpriteFrame(
    facingDirection,
    currentAnimation,
    animationIndex
  );

  renderModel(model, camera, ctx, sprites[frameIndex], options);
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

function _getAnimationIndex(
  currentAnimation: number[] | null,
  player: Player
): number {
  let animationIndex = -1;

  if (currentAnimation) {
    const frameLength = GRID_INTERVAL / currentAnimation.length;

    const progressMetric =
      currentAnimation == walkingDownAnimation ||
      currentAnimation == walkingUpAnimation
        ? player.worldY
        : player.worldX;

    const progress = Math.abs(progressMetric) % GRID_INTERVAL;
    const normalizedProgress = progress / frameLength;
    animationIndex = Math.ceil(normalizedProgress) - 1;
    if (animationIndex < 0) animationIndex = 0;
  }

  return animationIndex;
}
