import { isTree } from "../../models/tree";
import { CoordinateMap, LayerMaps, LayerMark } from "../../coordinate_map";
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
import { Camera } from "../../camera";
import { isPlayer } from "../../models/player";
import { renderWithoutPatterning, renderWithPatterning } from "./optimizers";
import { isRoof } from "../../models/roof";
import { renderRoof } from "../model_renderers/roof_renderer";

export const pipelineRender = (
  renderable: any,
  camera: Camera,
  layerMaps: LayerMaps,
  doNotRenderMap: CoordinateMap<LayerMark>,
  renderedMap: CoordinateMap<LayerMark>,
  bufferCtx: CanvasRenderingContext2D
): [CoordinateMap<LayerMark>, CoordinateMap<LayerMark>] => {
  if (camera.withinLens(renderable)) {
    if (isStreet(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithoutPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        () => {
          renderStreet(renderable, camera, bufferCtx);
        }
      );
    }
    if (isHouseFloor(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithoutPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        () => {
          renderHouseFloor(renderable, camera, bufferCtx);
        }
      );
    }
    if (isTree(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        (count: number) => {
          renderTree(renderable, camera, bufferCtx, count);
        },
        isTree
      );
    }
    if (isWall(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithoutPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        () => {
          renderWall(renderable, camera, bufferCtx, layerMaps);
        }
      );
    }
    if (isHouseWall(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        (count: number) => {
          renderHouseWall(renderable, camera, bufferCtx, count);
        },
        isHouseWall
      );
    }
    if (isWater(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithoutPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        () => {
          renderWater(renderable, camera, bufferCtx);
        }
      );
    }
    if (isPlayer(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithoutPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        () => {
          renderPlayer(renderable, camera, bufferCtx);
        }
      );
    }
    if (isRoof(renderable)) {
      [doNotRenderMap, renderedMap] = renderWithPatterning(
        renderable,
        layerMaps,
        doNotRenderMap,
        renderedMap,
        (count: number) => {
          renderRoof(renderable, camera, bufferCtx, count);
        },
        isRoof
      );
    }
  }

  return [doNotRenderMap, renderedMap];
};
