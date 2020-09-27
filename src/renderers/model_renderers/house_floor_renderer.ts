import { Camera } from "../../camera";
import sprites from "../../sprite_collections/street_sprite_collection";
import { HouseFloor } from "../../models/house_floor";
import { renderModel } from "../helpers/render_model";

export const renderHouseFloor = (
  model: HouseFloor,
  camera: Camera,
  ctx: CanvasRenderingContext2D
) => {
  renderModel(model, camera, ctx, sprites[1]);
};
