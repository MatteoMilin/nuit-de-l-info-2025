import { laserState } from '../state';
import './styles.css';

const formatScore = (score: number) =>
  `LA ZERGUÈM // ${score.toString().padStart(6, '0')}`;

export const createHUD = () => {
  const overlay = document.createElement('div');
  overlay.id = 'laser-game-overlay';

  const hud = document.createElement('section');
  hud.className = 'laser-hud';

  const score = document.createElement('div');
  score.className = 'laser-score';
  score.textContent = formatScore(0);

  const healthBar = document.createElement('div');
  healthBar.className = 'laser-health-bar';

  const healthFill = document.createElement('div');
  healthFill.className = 'laser-health-fill';
  healthFill.style.width = '100%';

  const healthLabel = document.createElement('span');
  healthLabel.className = 'laser-health-label';
  healthLabel.textContent = 'HP // 100%';

  healthBar.appendChild(healthFill);
  hud.append(score, healthBar, healthLabel);
  document.body.append(overlay, hud);

  document.body.classList.add('laser-game-active');

  laserState.hud = {
    score,
    healthFill,
    healthLabel,
  };
};

export const updateScore = () => {
  if (!laserState.hud) return;
  laserState.hud.score.textContent = formatScore(laserState.score);
};

export const updateHealth = () => {
  if (!laserState.hud) return;
  laserState.hud.healthFill.style.width = `${laserState.health}%`;
  laserState.hud.healthLabel.textContent = `HP // ${Math.max(0, Math.round(laserState.health))}%`;

  const fill = laserState.hud.healthFill;
  fill.style.background =
    laserState.health > 50
      ? 'linear-gradient(90deg, var(--laser-green), #61ff9b)'
      : laserState.health > 25
        ? 'linear-gradient(90deg, var(--laser-amber), #ffad33)'
        : 'linear-gradient(90deg, var(--laser-red), #ff3366)';
};

export const cleanupHUD = () => {
  document.body.classList.remove('laser-game-active');
  document.getElementById('laser-game-overlay')?.remove();
  document.querySelector('.laser-hud')?.remove();
  laserState.hud = null;
};
