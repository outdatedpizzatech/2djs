import { isTree } from "../../models/tree";
import { renderPlayer } from "../model_renderers/player_renderer";
import { renderTree } from "../model_renderers/tree_renderer";
import { isWall } from "../../models/wall";
import { renderWall } from "../model_renderers/wall_renderer";
import { isWater } from "../../models/water";
import { renderWater } from "../model_renderers/water_renderer";
import { isStreet } from "../../models/street";
import { renderStreet } from "../model_renderers/street_renderer";
import { isHouseWall } from "../../models/house_wall";
import { renderHouseWall } from "../model_renderers/house_wall_renderer";
import { isHouseFloor } from "../../models/house_floor";
import { renderHouseFloor } from "../model_renderers/house_floor_renderer";
import { isPlayer, Player } from "../../models/player";
import { isRoof } from "../../models/roof";
import { renderRoof } from "../model_renderers/roof_renderer";
import { isDoor } from "../../models/door";
import { renderDoor } from "../model_renderers/door_renderer";
import { GameState } from "../../game_state";
import { isEmpty } from "../../models/empty";
import { renderEmpty } from "../model_renderers/empty_renderer";
import { isFlower } from "../../models/flower";
import { renderFlower } from "../model_renderers/flower_renderer";

export const matchesObject = (a: any, b: any): boolean => {
  if (isTree(a)) {
    return isTree(b);
  }
  if (isRoof(a)) {
    return isRoof(b);
  }
  return false;
};

export const pipelineRender = (
  renderable: any,
  bufferCtx: CanvasRenderingContext2D,
  count: number,
  gameState: GameState
): void => {
  const { camera, layerMaps, players, debug } = gameState;

  const options = { debug };

  if (isStreet(renderable)) {
    renderStreet(renderable, camera, bufferCtx, count, options);
  }
  if (isFlower(renderable)) {
    renderFlower(renderable, camera, bufferCtx, count, options);
  }
  if (isHouseFloor(renderable)) {
    renderHouseFloor(renderable, camera, bufferCtx, count, options);
  }
  if (isTree(renderable)) {
    renderTree(renderable, camera, bufferCtx, count, options);
  }
  if (isWall(renderable)) {
    renderWall(renderable, camera, bufferCtx, layerMaps, count, options);
  }
  if (isHouseWall(renderable)) {
    renderHouseWall(renderable, camera, bufferCtx, count, options);
  }
  if (isWater(renderable)) {
    renderWater(renderable, camera, bufferCtx, count, options);
  }
  if (isPlayer(renderable)) {
    renderPlayer(renderable, camera, bufferCtx, count, options);
  }
  if (isDoor(renderable)) {
    renderDoor(
      renderable,
      camera,
      bufferCtx,
      Object.values(players) as Player[],
      count,
      options
    );
  }
  if (isRoof(renderable)) {
    renderRoof(renderable, camera, bufferCtx, count, options);
  }
  if (isEmpty(renderable)) {
    renderEmpty(renderable, camera, bufferCtx, options);
  }
};
