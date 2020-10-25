import { Subject } from "rxjs";
import { startWith } from "rxjs/operators";

export const scaleXSubject$: Subject<boolean> = new Subject();
export const scaleX$ = scaleXSubject$.asObservable().pipe(startWith(false));
