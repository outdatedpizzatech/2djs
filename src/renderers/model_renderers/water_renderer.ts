import { Camera } from "../../camera";
import sprites from "../../sprite_collections/water_sprite_collection";
import { Water } from "../../models/water";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderWater = (
  model: Water,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
