import gunCursor from '../assets/gun.png';
import { cleanupAudio, initAudio } from '../laserGame/audio';
import { cleanupEnemies, spawnEnemyWave } from '../laserGame/enemies';
import { registerGameOverHandler } from '../laserGame/mechanics';
import { laserState, resetLaserState } from '../laserGame/state';
import { attachLaserTargets, cleanupTargets } from '../laserGame/targets';
import {
  cleanupHUD,
  createHUD,
  updateHealth,
  updateScore,
} from '../laserGame/ui/hud';

let cursorStyleTag: HTMLStyleElement | null = null;
let mouseMoveListener: ((event: MouseEvent) => void) | null = null;

const enableLaserCursor = () => {
  if (cursorStyleTag) return;
  cursorStyleTag = document.createElement('style');
  cursorStyleTag.id = 'laser-game-cursor';
  cursorStyleTag.textContent = `
    * {
      cursor: url('${gunCursor}') 16 16, crosshair !important;
    }
  `;
  document.head.appendChild(cursorStyleTag);
};

const disableLaserCursor = () => {
  cursorStyleTag?.remove();
  cursorStyleTag = null;
};

const startMouseTracking = () => {
  if (mouseMoveListener) return;
  const handler = (event: MouseEvent) => {
    laserState.mouseX = event.clientX;
    laserState.mouseY = event.clientY;
  };
  mouseMoveListener = handler;
  window.addEventListener('mousemove', handler);
};

const stopMouseTracking = () => {
  if (!mouseMoveListener) return;
  window.removeEventListener('mousemove', mouseMoveListener);
  mouseMoveListener = null;
};

const showGameOverScreen = (finalScore: number) => {
  document.querySelector('.laser-game-over')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'laser-game-over';
  overlay.innerHTML = 'GAME OVER';

  const scoreLabel = document.createElement('span');
  scoreLabel.textContent = `SCORE // ${finalScore.toString().padStart(6, '0')}`;
  overlay.appendChild(scoreLabel);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Revenir';
  closeButton.addEventListener('click', () => overlay.remove());
  overlay.appendChild(closeButton);

  document.body.appendChild(overlay);
};

const cleanupLaserGame = () => {
  stopMouseTracking();
  cleanupTargets();
  cleanupEnemies();
  cleanupHUD();
  cleanupAudio();
  disableLaserCursor();
};

const endLaserGame = () => {
  if (!laserState.active) return;
  laserState.active = false;
  const finalScore = laserState.score;
  cleanupLaserGame();
  showGameOverScreen(finalScore);
  resetLaserState();
};

export const activateLaserGame = () => {
  if (laserState.active) return;

  resetLaserState();
  laserState.active = true;

  document.querySelector('.laser-game-over')?.remove();
  enableLaserCursor();
  createHUD();
  updateScore();
  updateHealth();
  initAudio();
  startMouseTracking();
  registerGameOverHandler(endLaserGame);
  attachLaserTargets();
  spawnEnemyWave();
};
