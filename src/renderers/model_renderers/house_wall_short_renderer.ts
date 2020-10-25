import { Camera } from "../../camera";
import sprites from "../../sprite_collections/house_wall_short_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { HouseWallShort } from "../../models/house_wall_short";

export const renderHouseWallShort = (
  model: HouseWallShort,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[0];

  renderModel(model, camera, ctx, sprite, options);
};
