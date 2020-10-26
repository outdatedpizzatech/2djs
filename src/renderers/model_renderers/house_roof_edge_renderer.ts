import { Camera } from "../../camera";
import sprites from "../../sprite_collections/house_roof_edge_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { HouseRoofEdge } from "../../models/house_roof_edge";

export const renderHouseRoofEdge = (
  model: HouseRoofEdge,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[0];

  renderModel(model, camera, ctx, sprite, options);
};
