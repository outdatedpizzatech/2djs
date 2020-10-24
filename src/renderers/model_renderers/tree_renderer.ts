import { Camera } from "../../camera";
import { Tree } from "../../models/tree";
import sprites from "../../sprite_collections/tree_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderTree = (
  model: Tree,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
