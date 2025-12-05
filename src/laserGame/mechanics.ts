import { laserState } from './state';
import { updateHealth, updateScore } from './ui/hud';

let onGameOver: (() => void) | null = null;

export const registerGameOverHandler = (handler: () => void) => {
  onGameOver = handler;
};

export const addScore = (points: number) => {
  laserState.score += points;
  updateScore();
};

export const damagePlayer = (amount: number) => {
  if (laserState.health <= 0) return;

  laserState.health = Math.max(0, laserState.health - amount);
  updateHealth();

  if (laserState.health <= 0 && onGameOver) {
    onGameOver();
  }
};
