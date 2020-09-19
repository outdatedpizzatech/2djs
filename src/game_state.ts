import {Player} from "./player";
import {Camera} from "./camera";
import {Tree} from "./tree";

export interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
  trees: Tree[];
}
