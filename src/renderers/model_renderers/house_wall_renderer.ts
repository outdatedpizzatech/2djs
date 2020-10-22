import { Camera } from "../../camera";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { HouseWall, HouseWallRole } from "../../models/house_wall";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";

export const renderHouseWall = (
  model: HouseWall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  xCount: number,
  options: RenderOptions
) => {
  const sprite = model.role == HouseWallRole.SIDE ? sprites[2] : sprites[3];

  renderModel(model, camera, ctx, sprite, xCount, options);
};
