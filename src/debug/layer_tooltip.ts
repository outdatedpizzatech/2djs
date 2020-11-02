import { getAtPath } from "../coordinate_map";
import { GameState } from "../game_state";
import { DebugArea } from "./types";
import { GameObject } from "../game_object";

const objectDisplay = (gameObject: GameObject | null) => {
  return `${gameObject?.objectType ?? ""} ${JSON.stringify(gameObject)}`;
};

export const showLayerTooltip = (params: {
  gameState: GameState;
  x: number;
  y: number;
  debug: DebugArea;
  color: string;
}) => {
  const { debug, gameState, x, y, color } = params;

  debug.coordinates.innerText = `Mouse:\r${x},${y}`;

  const interactiveObject = getAtPath(gameState.layerMaps.interactiveMap, x, y);
  const overheadObject = getAtPath(gameState.layerMaps.overheadMap, x, y);
  const passiveObject = getAtPath(gameState.layerMaps.passiveMap, x, y);
  const groundObject = getAtPath(gameState.layerMaps.groundMap, x, y);

  let inspectorText = "";

  if (interactiveObject)
    inspectorText += `\r Interactive Layer: ${objectDisplay(
      interactiveObject
    )} \r`;
  if (overheadObject)
    inspectorText += `\r Overhead Layer: ${objectDisplay(overheadObject)} \r`;
  if (passiveObject)
    inspectorText += `\r Passive Layer: ${objectDisplay(passiveObject)} \r`;
  if (groundObject)
    inspectorText += `\r Ground Layer: ${objectDisplay(groundObject)} \r`;

  debug.layerInspectorDiv.innerText = inspectorText;
  debug.layerInspectorDiv.style.background = color;
};
