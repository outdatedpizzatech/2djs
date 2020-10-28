import { Player } from "./models/player";
import { Camera } from "./camera";
import { LayerMaps } from "./coordinate_map";

export interface GameState {
  camera: Camera;
  layerMaps: LayerMaps;
  myClientId: string;
  players: { [key: string]: Player | undefined };
  debug: {
    layerVisibility: { [string: number]: boolean };
    selectedGroupId: string | null;
  };
}
