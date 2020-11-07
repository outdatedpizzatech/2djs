import { Observable, Subject } from "rxjs";
import { frame$ } from "./frame";
import { map, scan, startWith, withLatestFrom } from "rxjs/operators";

export enum TransitioningBehavior {
  NONE,
  OUT,
  IN,
}

export const transitioningBehaviorSubject$: Subject<TransitioningBehavior> = new Subject();
export const transitioningBehavior$ = transitioningBehaviorSubject$.asObservable();

export const transitionPercent$: Observable<number> = frame$.pipe(
  withLatestFrom(transitioningBehavior$),
  map(([_, behavior]) => behavior),
  scan((acc, curr) => {
    const interval = 0.05;
    if (curr == TransitioningBehavior.OUT) {
      acc -= interval;
      if (acc <= interval) {
        acc = 0;
      }
    }

    if (curr == TransitioningBehavior.IN) {
      acc += interval;
      if (acc >= 1 - interval) {
        acc = 1;
      }
    }

    return acc;
  }, 1),
  startWith(1)
);

export const transitioning$: Observable<boolean> = transitioningBehavior$.pipe(
  map(
    (behavior) =>
      behavior == TransitioningBehavior.OUT ||
      behavior == TransitioningBehavior.IN
  ),
  startWith(false)
);
