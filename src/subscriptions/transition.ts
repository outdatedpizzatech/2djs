import { map, withLatestFrom } from "rxjs/operators";
import {
  TransitioningBehavior,
  transitioningBehavior$,
  transitioningBehaviorSubject$,
  transitionPercent$,
} from "../signals/transition";

export const addTransitionSubscriptions = () => {
  transitionPercent$
    .pipe(
      withLatestFrom(transitioningBehavior$),
      map(([percent, behavior]) => ({ percent, behavior }))
    )
    .subscribe(({ percent, behavior }) => {
      if (behavior == TransitioningBehavior.OUT && percent == 0) {
        transitioningBehaviorSubject$.next(TransitioningBehavior.IN);
      } else if (behavior == TransitioningBehavior.IN && percent == 1) {
        transitioningBehaviorSubject$.next(TransitioningBehavior.NONE);
      }
    });
};
