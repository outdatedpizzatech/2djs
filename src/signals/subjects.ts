import { Subject } from "rxjs";
import { GameState } from "../game_state";
import { GameObject } from "../game_object";
import { Layer } from "../types";

export const currentMapIdSubject$: Subject<string | null> = new Subject<
  string | null
>();
export const selectedEditorObjectSubject$: Subject<string> = new Subject();
export const selectedGroupUuidSubject$: Subject<string> = new Subject();
export const coordinatesToLoadForMyPlayerSubject$ = new Subject<{
  x: number;
  y: number;
}>();
export const gameStateSubject$: Subject<GameState> = new Subject();
export const whenTheMapIsLoaded$ = new Subject<GameObject[]>();

export const layerVisibility$: Subject<{
  layer: Layer;
  visible: boolean;
}> = new Subject();
