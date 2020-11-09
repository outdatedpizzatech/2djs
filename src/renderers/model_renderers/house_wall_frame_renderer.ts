import { Camera } from "../../camera";
import sprites from "../../sprite_collections/house_wall_frame_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { UNIT_BASE } from "../../common";
import { HouseWallFrame } from "../../models/house_wall_frame";

export const renderHouseWallFrame = (
  model: HouseWallFrame,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[0];

  renderModel(model, camera, ctx, sprite, options);
};
