import { Camera } from "../../camera";
import sprites from "../../sprite_collections/house_roof_sprite_collection";
import { RenderOptions } from "./types";
import { renderModel } from "../helpers/render_model";
import { HouseRoof } from "../../models/house_roof";
import { UNIT_BASE } from "../../common";

export const renderHouseRoof = (
  model: HouseRoof,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) => {
  const sprite = sprites[0];

  options.dimensions = {
    width: UNIT_BASE,
    height: UNIT_BASE * 2,
  };

  renderModel(model, camera, ctx, sprite, options);
};
