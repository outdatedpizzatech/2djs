import { Direction } from "../direction";
import { v4 as uuidv4 } from "uuid";
import { GameObject, gameObjectFactory } from "../game_object";
import { Layer } from "../types";
import axios from "axios";
import {
  API_URI_BASE,
  GRID_INTERVAL,
  SPAWN_COORDINATE,
  UNIT_BASE,
} from "../common";

export interface Person extends GameObject {
  objectType: "Person";
}

export const isPerson = (unknownObject: any): unknownObject is Person => {
  if (!unknownObject) return false;
  return (unknownObject as Person).objectType === "Person";
};

export const personFactory = (
  attributes: Partial<Person> & { _id: string }
): Person => {
  const gameObjectProperties = gameObjectFactory(attributes);

  const particularProperties = {
    _id: attributes._id,
    objectType: "Person" as "Person",
    layer: Layer.INTERACTIVE,
  };

  return { ...gameObjectProperties, ...particularProperties };
};
