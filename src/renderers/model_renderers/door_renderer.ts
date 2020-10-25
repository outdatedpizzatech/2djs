import { Camera } from "../../camera";
import sprites from "../../sprite_collections/door_sprite_collection";
import { renderModel } from "../helpers/render_model";
import { Door } from "../../models/door";
import { Player } from "../../models/player";
import { RenderOptions } from "./types";
import { UNIT_BASE } from "../../common";

export const renderDoor = (
  model: Door,
  camera: Camera,
  ctx: CanvasRenderingContext2D,
  players: Player[],
  options: RenderOptions
) => {
  const overlappingPlayer = players.find(
    (player) => model.x == player.x && model.y == player.y
  );

  let sprite = sprites[0];

  if (overlappingPlayer) {
    sprite = sprites[1];
  }

  options.dimensions = {
    width: UNIT_BASE,
    height: UNIT_BASE * 2,
  };

  renderModel(model, camera, ctx, sprite, options);
};
