import {
  selectedEditorObjectSubject$,
  selectedGroupUuidSubject$,
} from "./subjects";
import { startWith } from "rxjs/operators";
import { v4 as uuidv4 } from "uuid";

export const selectedEditorObject$ = selectedEditorObjectSubject$
  .asObservable()
  .pipe(startWith(""));

export const selectedGroupUuid$ = selectedGroupUuidSubject$
  .asObservable()
  .pipe(startWith(uuidv4()));
