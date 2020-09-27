import { Camera } from "../../camera";
import sprites from "../../sprite_collections/door_sprite_collection";
import { renderModel } from "../helpers/render_model";
import { Door } from "../../models/door";

export const renderDoor = (
  model: Door,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  renderModel(model, camera, ctx, sprites[0]);
};
