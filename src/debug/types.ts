import { GameObjectType } from "../types";

export interface DebugArea {
  gridlines: HTMLInputElement;
  fps: HTMLDivElement;
  objects: HTMLDivElement;
  coordinates: HTMLDivElement;
  layerInspectorDiv: HTMLDivElement;
}

export type EditableGameObjectType = Exclude<
  GameObjectType,
  "Player" | "Person"
>;
