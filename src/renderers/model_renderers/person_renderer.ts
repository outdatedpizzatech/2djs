import { Camera } from "../../camera";
import { Person } from "../../models/person";
import sprites from "../../sprite_collections/person_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderPerson = (
  model: Person,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  renderModel(model, camera, ctx, sprites[0], options);
};
