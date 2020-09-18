import {Player} from "./player";
import {Camera} from "./camera";

export interface GameState {
  player: Player;
  otherPlayer: Player;
  camera: Camera;
}
