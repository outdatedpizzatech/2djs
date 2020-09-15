import {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  Direction,
  GRID_INTERVAL,
} from "./common";
import { Camera } from "./camera";

const movementSpeed = 1;

const walkingDownAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];

interface PlayerAttributes {
  color: string;
  x: number;
  y: number;
  icon: string;
}

export class Player {
  public renderX: number;
  public renderY: number;

  private canvas: HTMLCanvasElement;
  private color: string;
  private tweenDirection: Direction = Direction.NONE;
  private icon: string;
  private animationIndex: number = -1;

  constructor(attributes: PlayerAttributes) {
    const canvas = document.createElement("canvas");
    canvas.style.zIndex = "2";
    canvas.style.position = "absolute";
    canvas.width = CAMERA_WIDTH;
    canvas.height = CAMERA_HEIGHT;

    this.canvas = canvas;
    this.color = attributes.color;
    this.renderX = attributes.x;
    this.renderY = attributes.y;
    this.icon = attributes.icon;
  }

  view(): HTMLCanvasElement {
    return this.canvas;
  }

  render(camera: Camera) {
    const ctx = this.canvas.getContext("2d");
    ctx.restore();

    const { x, y } = camera.offset();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.renderX + x,
      this.renderY + y,
      GRID_INTERVAL,
      GRID_INTERVAL
    );

    var img = new Image(); // Create new img element
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAABiCAYAAABnEP6gAAAAAXNSR0IArs4c6QAAAMBlWElmTU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAPAAAAcgEyAAIAAAAUAAAAgodpAAQAAAABAAAAlgAAAAAAAABIAAAAAQAAAEgAAAABUGl4ZWxtYXRvciAzLjkAADIwMjA6MDk6MTUgMDA6MDk6NTcAAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAPSgAwAEAAAAAQAAAGIAAAAAYkE3DgAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj45ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjQ0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuOTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMC0wOS0xNVQwMDowOTo1NzwveG1wOk1vZGlmeURhdGU+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgq2e0etAAADXElEQVR4Ae3ZMW7cMBAAwLsghcs8JWWe4Wf4SXmGn5EyT3Hp7qJltMRGoSzp5DTxCDBIkdw9Y4CF9nTXy/i6jZcv15X15fLZ+GU+9wQI7BAYFejt9ds48uFHWx/F1ICz8TWXOQECBwSWxblajJlzo6jPxufHGAkQuEPg05GYKOa1p/eePGfj93yGMwQ+ssCwoF+/Pw9NopjnJ/RwPxfPxmceIwECxwSGBR0psihzzLR7n9AZl+PR+DxvJEDgfoH4DhxvqNvfy8/nPo+1srf2CfXM7Y74tbzWCRDYIVCf0O2npmipp0LsoTnPcd5oZ/uh35Oz8Yt0bgkQOCqQb7n72+n8jrwo4MuXr48td7bc87n3ij/6fztPgMCGQGuvo60urXVbm+La2lTktY1epmt7cWYtfrG+jHdPgMBJgWy5oxj/aLWn4utXnffFjUmNqfPyOaO2fSOrbQIE3hL4vNyMVjoLMMc401rsue2ebrPVruHXqS3vRRqxNT5zvNQIcwIE3lWgFmYvxniK5vXw9Nh/wsrv0dNejcujMbYcGV9jY7PEx+1ajthzESBwh8CoqPoLsshXn9jzi7BYHsXFeivofDLX2Nic49di44iLAIETAn+13KNcpZBj+62CjL3b4vwopTUCBP6BQL4Uq6mvGwXZW/MaNM9X9zydB1qWCBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQL/pcAvS97Je8LocYgAAAAASUVORK5CYII=";

    ctx.save();

    let frameIndex = 0;

    if (this.tweenDirection == Direction.DOWN) {
      this.animationIndex++;
      if (walkingDownAnimation.length <= this.animationIndex) {
        this.animationIndex = 0;
      }
    } else {
      this.animationIndex = -1;
    }

    if (this.animationIndex >= 0) {
      frameIndex = walkingDownAnimation[this.animationIndex];
    }

    ctx.beginPath();
    ctx.rect(this.renderX + x, this.renderY + y, GRID_INTERVAL, GRID_INTERVAL);
    ctx.clip();

    ctx.drawImage(
      img,
      this.renderX + x - frameIndex * GRID_INTERVAL,
      this.renderY + y
    );
  }

  moveBy(movementDirection: Direction) {
    if (!this.tweenDirection) {
      this.tweenDirection = movementDirection;
    }
  }

  refreshMovement() {
    if (!this.tweenDirection) {
      return;
    }

    if (this.tweenDirection == Direction.UP) {
      this.renderY -= movementSpeed;

      if (this.renderY % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }

    if (this.tweenDirection == Direction.RIGHT) {
      this.renderX += movementSpeed;

      if (this.renderX % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }

    if (this.tweenDirection == Direction.DOWN) {
      this.renderY += movementSpeed;

      if (this.renderY % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }

    if (this.tweenDirection == Direction.LEFT) {
      this.renderX -= movementSpeed;

      if (this.renderX % GRID_INTERVAL === 0) {
        this.tweenDirection = Direction.NONE;
      }
    }
  }
}
