import { Camera } from "../../camera";
import sprites from "../../sprite_collections/stairway_railing_bottom_right_sprite_collection";
import { StairwayRailingBottomRight } from "../../models/stairway_railing_bottom_right";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderStairwayRailingBottomRight = (
  model: StairwayRailingBottomRight,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
