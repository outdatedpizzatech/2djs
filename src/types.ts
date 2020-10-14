export enum Layer {
  GROUND,
  PASSIVE,
  INTERACTIVE,
  OVERHEAD,
}

export type Unsaved<T> = Omit<T, "_id">;
