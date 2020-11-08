import { Camera } from "../../camera";
import sprites from "../../sprite_collections/stairway_railing_bottom_left_sprite_collection";
import { StairwayRailingBottomLeft } from "../../models/stairway_railing_bottom_left";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderStairwayRailingBottomLeft = (
  model: StairwayRailingBottomLeft,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
