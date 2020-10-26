import { Camera } from "../../camera";
import sprites from "../../sprite_collections/house_roof_steeple_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { HouseRoofSteeple } from "../../models/house_roof_steeple";

export const renderHouseRoofSteeple = (
  model: HouseRoofSteeple,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[0];

  renderModel(model, camera, ctx, sprite, options);
};
