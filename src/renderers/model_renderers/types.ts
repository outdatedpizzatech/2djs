import { Player } from "../../models/player";

export interface RenderOptions {
  dimensions?: {
    width?: number;
    height?: number;
  };
  debug?: {
    selectedGroupId: string | null;
  };
  worldX?: number;
  worldY?: number;
  y: number;
  players: Player[];
}
