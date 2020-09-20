import { Direction } from "./direction";

export interface KeyMap {
  [key: string]: boolean;
}

export function getDirectionFromKeyMap(keymap: KeyMap): Direction {
  let direction = Direction.NONE;

  if (keymap["ArrowUp"]) {
    direction = Direction.UP;
  } else if (keymap["ArrowRight"]) {
    direction = Direction.RIGHT;
  } else if (keymap["ArrowDown"]) {
    direction = Direction.DOWN;
  } else if (keymap["ArrowLeft"]) {
    direction = Direction.LEFT;
  }

  return direction;
}
