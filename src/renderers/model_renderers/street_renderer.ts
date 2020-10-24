import { Camera } from "../../camera";
import sprites from "../../sprite_collections/street_sprite_collection";
import { Street } from "../../models/street";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderStreet = (
  model: Street,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
