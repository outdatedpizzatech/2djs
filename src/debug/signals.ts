import { Subject } from "rxjs";
import { startWith } from "rxjs/operators";
import {
  selectedEditorObjectSubject$,
  selectedGroupUuidSubject$,
} from "../signals/subjects";
import { v4 as uuidv4 } from "uuid";
import { Layer } from "../types";

export const scaleXSubject$: Subject<boolean> = new Subject();
export const scaleX$ = scaleXSubject$.asObservable().pipe(startWith(false));

export const selectedEditorObject$ = selectedEditorObjectSubject$
  .asObservable()
  .pipe(startWith(""));

export const selectedGroupUuid$ = selectedGroupUuidSubject$
  .asObservable()
  .pipe(startWith(uuidv4()));

export const layerVisibilitySubject$: Subject<{
  layer: Layer;
  visible: boolean;
}> = new Subject();
