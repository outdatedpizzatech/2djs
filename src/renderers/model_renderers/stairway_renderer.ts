import { Camera } from "../../camera";
import sprites from "../../sprite_collections/stairway_sprite_collection";
import { Stairway } from "../../models/stairway";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderStairway = (
  model: Stairway,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
