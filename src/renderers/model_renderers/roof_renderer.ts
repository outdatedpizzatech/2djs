import { Camera, project } from "../../camera";
import sprites from "../../sprite_collections/roof_sprite_collection";
import { Roof } from "../../models/roof";
import { GRID_INTERVAL } from "../../common";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderRoof = (
  model: Roof,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
