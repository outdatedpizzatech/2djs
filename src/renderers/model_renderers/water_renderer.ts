import { Camera } from "../../camera";
import sprites from "../../sprite_collections/water_sprite_collection";
import { Water } from "../../models/water";
import { renderModel } from "../helpers/render_model";

export const renderWater = (
  model: Water,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  renderModel(model, camera, ctx, sprites[0]);
};
