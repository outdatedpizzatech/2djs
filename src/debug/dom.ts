import { CAMERA_WIDTH } from "../camera";
import { v4 as uuidv4 } from "uuid";
import {
  layerVisibility$,
  selectedEditorObject$,
  selectedEditorObjectSubject$,
  selectedGroupUuid$,
  selectedGroupUuidSubject$,
} from "../signals";
import { Layer } from "../types";
import { objectToSpriteMap } from "./helpers";
import { DebugArea, GameObjectType } from "./types";

export const mountDebugArea = (body: HTMLBodyElement): DebugArea => {
  const debugArea = document.createElement("div");
  debugArea.style.width = `${CAMERA_WIDTH}px`;
  debugArea.style.fontFamily = `Helvetica`;
  debugArea.style.fontSize = `12px`;
  debugArea.style.marginTop = `10px`;
  debugArea.style.marginLeft = "auto";
  debugArea.style.marginRight = "auto";
  debugArea.style.background = "gray";
  debugArea.style.display = "grid";
  debugArea.style.gridTemplateColumns = "10% 10% 10% 10% 10% 20%";
  body.appendChild(debugArea);

  const gridLinesLabel = document.createElement("label");
  const gridLinesInput = document.createElement("input");
  gridLinesInput.type = "checkbox";
  gridLinesLabel.innerText = "Gridlines";
  gridLinesLabel.style.color = "white";
  gridLinesLabel.style.padding = "10%";
  debugArea.appendChild(gridLinesLabel);
  gridLinesLabel.prepend(gridLinesInput);

  const fpsDiv = document.createElement("div");
  fpsDiv.style.background = "green";
  fpsDiv.style.color = "white";
  fpsDiv.style.padding = "10%";
  debugArea.appendChild(fpsDiv);

  const objectsDiv = document.createElement("div");
  objectsDiv.style.background = "blue";
  objectsDiv.style.color = "white";
  objectsDiv.style.padding = "10%";
  debugArea.appendChild(objectsDiv);

  const coordinatesDiv = document.createElement("div");
  coordinatesDiv.style.background = "purple";
  coordinatesDiv.style.color = "white";
  coordinatesDiv.style.padding = "10%";
  debugArea.appendChild(coordinatesDiv);

  const layerDiv = document.createElement("div");
  layerDiv.style.background = "red";
  layerDiv.style.color = "white";
  layerDiv.style.padding = "10%";
  debugArea.appendChild(layerDiv);

  const groupDiv = document.createElement("div");
  groupDiv.style.background = "brown";
  groupDiv.style.color = "white";
  groupDiv.style.padding = "10%";
  debugArea.appendChild(groupDiv);

  const shuffleButton = document.createElement("button");
  shuffleButton.innerText = "Shuffle ID";
  shuffleButton.style.display = "block";
  shuffleButton.addEventListener("click", () => {
    const uuid = uuidv4();
    selectedGroupUuidSubject$.next(uuid);
  });
  groupDiv.appendChild(shuffleButton);

  const pickGroupButton = document.createElement("button");
  pickGroupButton.innerText = "Pick";
  pickGroupButton.style.display = "block";
  pickGroupButton.addEventListener("click", () => {
    selectedEditorObjectSubject$.next("pickGroup");
  });
  groupDiv.appendChild(pickGroupButton);

  const setGroupButton = document.createElement("button");
  setGroupButton.innerText = "Set";
  setGroupButton.style.display = "block";
  setGroupButton.addEventListener("click", () => {
    selectedEditorObjectSubject$.next("setGroup");
  });
  groupDiv.appendChild(setGroupButton);

  const groupLabel = document.createElement("label");
  groupDiv.appendChild(groupLabel);

  const addLayerCheckbox = (layer: Layer, name: string) => {
    const layerLabel = document.createElement("label");
    layerLabel.style.display = "block";
    const layerCheckbox = document.createElement("input");
    layerCheckbox.type = "checkbox";
    layerCheckbox.checked = true;
    layerCheckbox.addEventListener("click", function () {
      layerVisibility$.next({ layer, visible: this.checked });
    });
    layerLabel.innerText = name;
    layerLabel.prepend(layerCheckbox);
    layerDiv.appendChild(layerLabel);
  };

  addLayerCheckbox(Layer.GROUND, "Ground");
  addLayerCheckbox(Layer.PASSIVE, "Passive");
  addLayerCheckbox(Layer.INTERACTIVE, "Interactive");
  addLayerCheckbox(Layer.OVERHEAD, "Overhead");

  const layerInspectorDiv = document.createElement("div");
  layerInspectorDiv.style.fontFamily = `Monospace`;
  layerInspectorDiv.style.fontSize = `12px`;
  layerInspectorDiv.style.background = "#333333";
  layerInspectorDiv.style.color = "white";
  layerInspectorDiv.style.position = "absolute";
  layerInspectorDiv.style.top = "0";
  layerInspectorDiv.style.left = "0";
  layerInspectorDiv.style.zIndex = "9999999999999";
  layerInspectorDiv.style.opacity = "0.95";

  body.appendChild(layerInspectorDiv);

  const editorArea = document.createElement("div");
  editorArea.style.width = `${CAMERA_WIDTH}px`;
  editorArea.style.fontFamily = `Helvetica`;
  editorArea.style.fontSize = `12px`;
  editorArea.style.marginTop = `10px`;
  editorArea.style.marginLeft = "auto";
  editorArea.style.marginRight = "auto";
  editorArea.style.background = "gray";
  editorArea.style.display = "grid";
  editorArea.style.gridTemplateColumns = "repeat(20, auto)";
  body.appendChild(editorArea);

  Object.keys(objectToSpriteMap).forEach((key: GameObjectType) => {
    const objectDiv = document.createElement("div");
    objectDiv.style.color = "white";
    objectDiv.style.padding = "10%";
    objectDiv.style.textAlign = "center";
    objectDiv.id = `object-${key}`;
    editorArea.appendChild(objectDiv);

    const labelDiv = document.createElement("div");
    labelDiv.innerText = key;
    labelDiv.style.fontSize = "10px";
    const sprite = objectToSpriteMap[key];
    sprite.width = 16;
    sprite.height = 16;
    objectDiv.appendChild(sprite);
    objectDiv.appendChild(labelDiv);
  });

  selectedEditorObject$.subscribe((value) => {
    Object.keys(objectToSpriteMap).forEach((key: GameObjectType) => {
      const objectDiv = document.getElementById(
        `object-${key}`
      ) as HTMLDivElement;

      objectDiv.onclick = () => {
        selectedEditorObjectSubject$.next(value == key ? "" : key);
      };
      objectDiv.style.background = value == key ? "yellow" : "none";
    });

    if (value == "pickGroup") {
      pickGroupButton.style.background = "yellow";
    } else {
      pickGroupButton.style.background = "rgb(239, 239, 239)";
    }

    if (value == "setGroup") {
      setGroupButton.style.background = "yellow";
    } else {
      setGroupButton.style.background = "rgb(239, 239, 239)";
    }
  });

  selectedGroupUuid$.subscribe((groupUuid) => {
    groupLabel.innerText = `Group ID:\r${groupUuid}`;
  });

  return {
    gridlines: gridLinesInput,
    fps: fpsDiv,
    objects: objectsDiv,
    coordinates: coordinatesDiv,
    layerInspectorDiv,
  };
};