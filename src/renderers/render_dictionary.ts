import { GameObjectType } from "../types";
import { Camera } from "../camera";
import { RenderOptions } from "./model_renderers/types";
import { renderTree } from "./model_renderers/tree_renderer";
import { renderStreet } from "./model_renderers/street_renderer";
import { renderFlower } from "./model_renderers/flower_renderer";
import { renderHouseFloor } from "./model_renderers/house_floor_renderer";
import { renderWall } from "./model_renderers/wall_renderer";
import { renderHouseWall } from "./model_renderers/house_wall_renderer";
import { renderHouseWallFrame } from "./model_renderers/house_wall_frame_renderer";
import { renderWater } from "./model_renderers/water_renderer";
import { renderPlayer } from "./model_renderers/player_renderer";
import { renderDoor } from "./model_renderers/door_renderer";
import { renderRoof } from "./model_renderers/roof_renderer";
import { renderEmpty } from "./model_renderers/empty_renderer";
import { renderHouseWallWindow } from "./model_renderers/house_wall_window_renderer";
import { renderHouseWallFrameShort } from "./model_renderers/house_wall_frame_short_renderer";
import { renderHouseWallShort } from "./model_renderers/house_wall_short_renderer";
import { renderHouseRoofSteeple } from "./model_renderers/house_roof_steeple_renderer";
import { renderHouseRoofEdge } from "./model_renderers/house_roof_edge_renderer";
import { renderHouseRoof } from "./model_renderers/house_roof_renderer";
import { renderStairway } from "./model_renderers/stairway_renderer";
import { renderStairwayTop } from "./model_renderers/stairway_top_renderer";
import { renderStairwayBottom } from "./model_renderers/stairway_bottom_renderer";
import { renderStairwayRailingBottomLeft } from "./model_renderers/stairway_railing_bottom_left_renderer";
import { renderStairwayRailingBottomRight } from "./model_renderers/stairway_railing_bottom_right_renderer";
import { loadShadow } from "./load_shadows";
import tree from "../sprite_collections/tree_sprite_collection";
import house_wall_frame from "../sprite_collections/house_wall_frame_sprite_collection";
import wall from "../sprite_collections/wall_sprite_collection";
import house_wall_frame_short from "../sprite_collections/house_wall_frame_short_sprite_collection";
import house_roof_edge from "../sprite_collections/house_roof_edge_sprite_collection";
import player from "../sprite_collections/player_sprite_collection";
import { UNIT_BASE } from "../common";

export type RenderDictionary = {
  [K in GameObjectType]: {
    shadow?: HTMLCanvasElement;
    renderFn: (
      renderable: { objectType: K },
      camera: Camera,
      bufferCtx: CanvasRenderingContext2D,
      options: RenderOptions
    ) => void;
    width?: number;
    height?: number;
  };
};

// NOTE: this is not a module which should be imported just anywhere, since it loads image data
// generally, this should just be run once, from index(), and its resulting value passed explicitly
export const getRenderDictionary: () => RenderDictionary = () => ({
  Tree: {
    renderFn: renderTree,
    shadow: loadShadow(tree[0]),
    width: UNIT_BASE,
    height: UNIT_BASE * 4,
  },
  Street: {
    renderFn: renderStreet,
  },
  Flower: {
    renderFn: renderFlower,
  },
  HouseFloor: {
    renderFn: renderHouseFloor,
  },
  Wall: {
    renderFn: renderWall,
    shadow: loadShadow(wall[0]),
  },
  HouseWall: {
    renderFn: renderHouseWall,
  },
  HouseWallFrame: {
    renderFn: renderHouseWallFrame,
    shadow: loadShadow(house_wall_frame[0]),
    width: UNIT_BASE,
    height: UNIT_BASE * 2,
  },
  Water: {
    renderFn: renderWater,
  },
  Player: {
    renderFn: renderPlayer,
    shadow: loadShadow(player[0]),
  },
  Door: {
    renderFn: renderDoor,
  },
  Roof: {
    renderFn: renderRoof,
  },
  Empty: {
    renderFn: renderEmpty,
  },
  HouseWallWindow: {
    renderFn: renderHouseWallWindow,
  },
  HouseWallShort: {
    renderFn: renderHouseWallShort,
  },
  HouseWallFrameShort: {
    renderFn: renderHouseWallFrameShort,
    shadow: loadShadow(house_wall_frame_short[0]),
  },
  HouseRoofSteeple: {
    renderFn: renderHouseRoofSteeple,
  },
  HouseRoofEdge: {
    renderFn: renderHouseRoofEdge,
    shadow: loadShadow(house_roof_edge[0]),
  },
  HouseRoof: {
    renderFn: renderHouseRoof,
  },
  Stairway: {
    renderFn: renderStairway,
  },
  StairwayTop: {
    renderFn: renderStairwayTop,
  },
  StairwayBottom: {
    renderFn: renderStairwayBottom,
  },
  StairwayRailingBottomLeft: {
    renderFn: renderStairwayRailingBottomLeft,
  },
  StairwayRailingBottomRight: {
    renderFn: renderStairwayRailingBottomRight,
  },
});
