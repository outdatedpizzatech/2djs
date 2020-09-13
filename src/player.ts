import { GRID_INTERVAL } from "./common";
import { Camera } from "./camera";

interface PlayerAttributes {
  color: string;
  x: number;
  y: number;
}

export class Player {
  private canvas: HTMLCanvasElement;
  private color: string;
  public renderX: number;
  public renderY: number;

  constructor(attributes: PlayerAttributes) {
    const canvas = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.width = 800;
    canvas.height = 600;

    this.canvas = canvas;
    this.color = attributes.color;
    this.renderX = attributes.x;
    this.renderY = attributes.y;
  }

  view(): HTMLCanvasElement {
    return this.canvas;
  }

  render(camera: Camera) {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.renderX + camera.offset().x,
      this.renderY + camera.offset().y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );
  }
}
