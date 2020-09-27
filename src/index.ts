import { filter, map, withLatestFrom } from "rxjs/operators";
import { cameraFactory } from "./camera";
import { isPlayer, Player, playerFactory } from "./models/player";
import { directionForFrame$, frameWithGameState$, gameState$ } from "./signals";
import { GameState, updateCoordinateMap } from "./game_state";
import {
  updatePlayerCoordinates,
  updatePlayerDirection,
  updatePlayerMovement,
} from "./reducers/player_reducer";
import { updateCameraPosition } from "./reducers/camera_reducer";
import { renderGameSpace } from "./renderers/game_renderer";
import { Tree, treeFactory } from "./models/tree";
import { Placeable, Positionable } from "./types";
import { getModsFromDirection } from "./direction";
import { Wall, wallFactory } from "./models/wall";
import { addView } from "./renderers/canvas_renderer";
import { renderFieldRenderables } from "./render_pipeline";
import { CoordinateMap, getFromCoordinateMap } from "./coordinate_map";
import corneriaMap from "./maps/corneria.txt";
import { Water, waterFactory } from "./models/water";
import { Street, streetFactory } from "./models/street";
import { renderGround } from "./renderers/ground_renderer";
import { HouseWall, houseWallFactory } from "./models/house_wall";
import { HouseFloor, houseFloorFactory } from "./models/house_floor";
import { loadDebugger, mountDebugArea } from "./debug/debugger";

function index() {
  const buffer = addView();
  const bufferCtx = buffer.getContext("2d") as CanvasRenderingContext2D;

  const player: Player = playerFactory({
    x: 10,
    y: 30,
  });

  const otherPlayer: Player = playerFactory({
    x: 20,
    y: 30,
  });

  const camera = cameraFactory({
    x: 0,
    y: 0,
  });

  let walls = new Array<Wall>();
  let trees = new Array<Tree>();
  let waters = new Array<Water>();
  let houseWalls = new Array<HouseWall>();
  let houseFloors = new Array<HouseFloor>();
  let streets = new Array<Street>();

  (corneriaMap as string).split(/\n/).forEach((line, y) => {
    line.split("").forEach((code, x) => {
      if (code == "x") {
        walls.push(wallFactory({ x, y }));
      }
      if (code == "l") {
        trees.push(treeFactory({ x, y }));
      }
      if (code == "o") {
        waters.push(waterFactory({ x, y }));
      }
      if (code == "m") {
        streets.push(streetFactory({ x, y }));
      }
      if (code == "u") {
        houseWalls.push(houseWallFactory({ x, y }));
      }
      if (code == "r") {
        houseFloors.push(houseFloorFactory({ x, y }));
      }
    });
  });

  const positionables = new Array<Placeable>()
    .concat([player, otherPlayer])
    .concat(trees)
    .concat(waters)
    .concat(streets)
    .concat(houseWalls)
    .concat(houseFloors)
    .concat(walls);

  const coordinateMap: CoordinateMap<Positionable> = positionables
    .filter((positionable) => !positionable.passable)
    .reduce((acc, positionable) => {
      const xRow = acc[positionable.x] || {};
      xRow[positionable.y] = positionable;
      acc[positionable.x] = xRow;
      return acc;
    }, {} as CoordinateMap<Positionable>);

  const fieldRenderables = positionables.filter(
    (positionable) => !isPlayer(positionable)
  );

  const initialGameState: GameState = {
    player,
    camera,
    otherPlayer,
    collisionMap: coordinateMap,
    fieldRenderables,
  };

  const { visibleCanvas, gameArea, body } = renderGameSpace();

  const visibleCtx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D;

  directionForFrame$
    .pipe(
      withLatestFrom(gameState$),
      filter(([_, gameState]) => !gameState.player.movementDirection),
      filter(([direction, gameState]) => {
        const { x, y } = player;
        const [xMod, yMod] = getModsFromDirection(direction);

        return !getFromCoordinateMap(
          x + xMod,
          y + yMod,
          gameState.collisionMap
        );
      }),
      map((params) => updateCoordinateMap(...params)),
      map((params) => updatePlayerCoordinates(...params)),
      map((params) => updatePlayerDirection(...params))
    )
    .subscribe(([_, gameState]) => {
      gameState$.next(gameState);
    });

  frameWithGameState$
    .pipe(map(([_, gameState]) => updateCameraPosition(gameState)))
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  frameWithGameState$.subscribe(([_, gameState]) => {
    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

    renderGround(bufferCtx, camera);
    renderFieldRenderables(bufferCtx, gameState);

    visibleCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);
    visibleCtx.drawImage(buffer, 0, 0);
  });

  frameWithGameState$
    .pipe(
      filter(([_, gameState]) => !!gameState.player.movementDirection),
      map(([deltaTime, gameState]) =>
        updatePlayerMovement(deltaTime, gameState)
      )
    )
    .subscribe((gameState) => {
      gameState$.next(gameState);
    });

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea, [player, otherPlayer], fieldRenderables);
  }

  gameState$.next(initialGameState);
}

index();
