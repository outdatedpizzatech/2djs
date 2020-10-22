import { Camera } from "../../camera";
import { Empty } from "../../models/empty";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderEmpty = (
  model: Empty,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, document.createElement("img"), 0, options);
};
