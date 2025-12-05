export type HUDRefs = {
  score: HTMLDivElement;
  healthFill: HTMLDivElement;
  healthLabel: HTMLSpanElement;
};

export type Enemy = {
  element: HTMLElement;
  health: number;
  shootInterval: number;
  moveInterval: number;
};

export type LaserGameState = {
  active: boolean;
  score: number;
  health: number;
  mouseX: number;
  mouseY: number;
  enemies: Enemy[];
  hud: HUDRefs | null;
};
