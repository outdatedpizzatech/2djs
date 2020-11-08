import { Camera } from "../../camera";
import sprites from "../../sprite_collections/stairway_bottom_sprite_collection";
import { StairwayBottom } from "../../models/stairway_bottom";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderStairwayBottom = (
  model: StairwayBottom,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
