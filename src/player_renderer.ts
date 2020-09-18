import { CAMERA_HEIGHT, CAMERA_WIDTH } from "./common";
import { Player } from "./player";

export class PlayerRenderer {
  private readonly _player: Player;
  private readonly _color: string;

  constructor(player: Player, color: string) {
    this._player = player;
    this._color = color;

    const canvas = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.width = CAMERA_WIDTH;
    canvas.height = CAMERA_HEIGHT;

    this._player.canvas = canvas;
  }

  view(): HTMLCanvasElement {
    return this._player.canvas;
  }
}
