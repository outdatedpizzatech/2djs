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
import { isHouseWallFrame } from "../../models/house_wall_frame";
import { renderHouseWallFrame } from "../model_renderers/house_wall_frame_renderer";
import { isHouseWallWindow } from "../../models/house_wall_window";
import { renderHouseWallWindow } from "../model_renderers/house_wall_window_renderer";
import { isHouseWallShort } from "../../models/house_wall_short";
import { renderHouseWallShort } from "../model_renderers/house_wall_short_renderer";
import { isHouseWallFrameShort } from "../../models/house_wall_frame_short";
import { renderHouseWallFrameShort } from "../model_renderers/house_wall_frame_short_renderer";
import { isHouseRoofSteeple } from "../../models/house_roof_steeple";
import { renderHouseRoofSteeple } from "../model_renderers/house_roof_steeple_renderer";
import { isHouseRoofEdge } from "../../models/house_roof_edge";
import { renderHouseRoofEdge } from "../model_renderers/house_roof_edge_renderer";
import { isHouseRoof } from "../../models/house_roof";
import { renderHouseRoof } from "../model_renderers/house_roof_renderer";

export const pipelineRender = (
  renderable: any,
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState,
  y: number
): void => {
  const { camera, layerMaps, players, debug } = gameState;

  const options = { debug };

  if (isStreet(renderable)) {
    renderStreet(renderable, camera, bufferCtx, options);
    return;
  }
  if (isFlower(renderable)) {
    renderFlower(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseFloor(renderable)) {
    renderHouseFloor(renderable, camera, bufferCtx, options);
    return;
  }
  if (isTree(renderable)) {
    renderTree(renderable, camera, bufferCtx, options);
    return;
  }
  if (isWall(renderable)) {
    renderWall(renderable, camera, bufferCtx, layerMaps, options);
    return;
  }
  if (isHouseWall(renderable)) {
    renderHouseWall(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseWallFrame(renderable)) {
    renderHouseWallFrame(renderable, camera, bufferCtx, options);
    return;
  }
  if (isWater(renderable)) {
    renderWater(renderable, camera, bufferCtx, options);
    return;
  }
  if (isPlayer(renderable)) {
    renderPlayer(renderable, camera, bufferCtx, options, y);
    return;
  }
  if (isDoor(renderable)) {
    renderDoor(
      renderable,
      camera,
      bufferCtx,
      Object.values(players) as Player[],
      options
    );
    return;
  }
  if (isRoof(renderable)) {
    renderRoof(renderable, camera, bufferCtx, options);
    return;
  }
  if (isEmpty(renderable)) {
    renderEmpty(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseWallWindow(renderable)) {
    renderHouseWallWindow(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseWallShort(renderable)) {
    renderHouseWallShort(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseWallFrameShort(renderable)) {
    renderHouseWallFrameShort(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseRoofSteeple(renderable)) {
    renderHouseRoofSteeple(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseRoofEdge(renderable)) {
    renderHouseRoofEdge(renderable, camera, bufferCtx, options);
    return;
  }
  if (isHouseRoof(renderable)) {
    renderHouseRoof(renderable, camera, bufferCtx, options);
    return;
  }

  throw new Error(
    `Could not find a rendering method for ${renderable.objectType}`
  );
};
