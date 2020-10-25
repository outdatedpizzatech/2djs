import { Camera } from "../../camera";
import sprites from "../../sprite_collections/house_wall_window_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { HouseWallWindow } from "../../models/house_wall_window";

export const renderHouseWallWindow = (
  model: HouseWallWindow,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[0];

  renderModel(model, camera, ctx, sprite, options);
};
