export enum Direction {
  NONE,
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export const getModsFromDirection = (direction: Direction): [number, number] => {
  let xMod = 0;
  let yMod = 0;

  if (direction == Direction.UP) {
    yMod = -1;
  } else if (direction == Direction.RIGHT) {
    xMod = 1;
  } else if (direction == Direction.DOWN) {
    yMod = 1;
  } else if (direction == Direction.LEFT) {
    xMod = -1;
  }

  return [xMod, yMod];
}
