import { DRAW_DISTANCE } from "./common";

export interface Coordinate {
  x: number;
  y: number;
}
export interface CoordinateBounds {
  min: Coordinate;
  max: Coordinate;
}

export const getLoadBoundsForCoordinate = (
  coordinate: Coordinate
): CoordinateBounds => {
  return {
    min: {
      x: coordinate.x - DRAW_DISTANCE,
      y: coordinate.y - DRAW_DISTANCE,
    },
    max: {
      x: coordinate.x + DRAW_DISTANCE,
      y: coordinate.y + DRAW_DISTANCE,
    },
  };
};

export const getDistance = (
  coordinate1: Coordinate,
  coordinate2: Coordinate
) => {
  const { x: x1, y: y1 } = coordinate1;
  const { x: x2, y: y2 } = coordinate2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
