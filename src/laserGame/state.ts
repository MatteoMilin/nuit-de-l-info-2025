import type { LaserGameState } from './types';

export const initialLaserState: LaserGameState = {
  active: false,
  score: 0,
  health: 100,
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2,
  enemies: [],
  hud: null,
};

export const laserState: LaserGameState = { ...initialLaserState };

export const resetLaserState = () => {
  laserState.active = false;
  laserState.score = 0;
  laserState.health = 100;
  laserState.mouseX = window.innerWidth / 2;
  laserState.mouseY = window.innerHeight / 2;
  laserState.enemies = [];
  laserState.hud = null;
};
