import { Player } from "../../models/player";
import { GameState } from "../../game_state";
import { GameObjectType } from "../../types";
import { RenderDictionary } from "../render_dictionary";

export const pipelineRender = (
  renderable: { objectType: GameObjectType },
  bufferCtx: CanvasRenderingContext2D,
  gameState: GameState,
  y: number,
  renderDictionary: RenderDictionary
): void => {
  const { camera, players, debug } = gameState;

  const playersArray = Object.values(players) as Player[];

  const dictionaryEntry = renderDictionary[renderable.objectType];

  const options = {
    debug,
    y,
    players: playersArray,
    dimensions: {
      width: dictionaryEntry.width,
      height: dictionaryEntry.height,
    },
  };

  // cast renderable as any because renderFn accepts a `never` argument
  dictionaryEntry.renderFn(renderable as any, camera, bufferCtx, options);
};
