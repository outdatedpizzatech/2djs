import { Camera } from "../../camera";
import sprites from "../../sprite_collections/flower_sprite_collection";
import { Flower } from "../../models/flower";
import { renderModel } from "../helpers/render_model";
import { RenderOptions } from "./types";

export const renderFlower = (
  model: Flower,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  count: number,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], count, options);
};
