import { Camera } from "../../camera";
import sprites from "../../sprite_collections/stairway_top_sprite_collection";
import { StairwayTop } from "../../models/stairway_top";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderStairwayTop = (
  model: StairwayTop,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
