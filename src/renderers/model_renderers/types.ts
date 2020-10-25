export interface RenderOptions {
  dimensions?: {
    width: number;
    height: number;
  };
  cropYLength?: number;
  cropYStart?: number;
  offsetY?: number;
  debug: {
    selectedGroupId: string | null;
  };
}
