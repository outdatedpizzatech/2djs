import { Camera } from "../../camera";
import sprites from "../../sprite_collections/wall_sprite_collection";
import { HouseWall } from "../../models/house_wall";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { UNIT_BASE } from "../../common";

export const renderHouseWall = (
  model: HouseWall,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[3];

  options.dimensions = {
    width: UNIT_BASE,
    height: UNIT_BASE * 2,
  };

  renderModel(model, camera, ctx, sprite, options);
};
