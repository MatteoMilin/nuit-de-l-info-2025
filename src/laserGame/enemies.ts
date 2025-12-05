import { playLaserSound } from './audio';
import { createMuzzleFlash, flashDamageOverlay } from './effects';
import { addScore, damagePlayer } from './mechanics';
import { laserState } from './state';
import type { Enemy } from './types';

const ENEMY_SIZE = 80;
const enemySpawnTimeouts: number[] = [];

const activeBullets = new Set<HTMLDivElement>();

const shootAtPlayer = (enemy: Enemy) => {
  if (!laserState.active) return;

  const bullet = document.createElement('div');
  bullet.className = 'enemy-bullet';
  bullet.style.position = 'fixed';
  bullet.style.width = '16px';
  bullet.style.height = '16px';
  bullet.style.borderRadius = '50%';
  bullet.style.background = 'radial-gradient(circle, #ffdad5, #ff0054)';
  bullet.style.zIndex = '9997';
  bullet.style.pointerEvents = 'none';

  const rect = enemy.element.getBoundingClientRect();
  const originX = rect.left + ENEMY_SIZE / 2;
  const originY = rect.top + ENEMY_SIZE / 2;
  let bulletX = originX;
  let bulletY = originY;

  const deltaX = laserState.mouseX - originX;
  const deltaY = laserState.mouseY - originY;
  const distance = Math.max(1, Math.hypot(deltaX, deltaY));
  const speed = 7;
  const velocityX = (deltaX / distance) * speed;
  const velocityY = (deltaY / distance) * speed;

  bullet.style.left = `${bulletX}px`;
  bullet.style.top = `${bulletY}px`;
  document.body.appendChild(bullet);
  activeBullets.add(bullet);

  const animate = () => {
    if (!laserState.active) {
      bullet.remove();
      activeBullets.delete(bullet);
      return;
    }

    bulletX += velocityX;
    bulletY += velocityY;
    bullet.style.left = `${bulletX}px`;
    bullet.style.top = `${bulletY}px`;

    const distToCursor = Math.hypot(
      bulletX - laserState.mouseX,
      bulletY - laserState.mouseY
    );

    if (distToCursor < 45) {
      damagePlayer(5);
      flashDamageOverlay();
      bullet.remove();
      activeBullets.delete(bullet);
      return;
    }

    if (
      bulletX < -100 ||
      bulletX > window.innerWidth + 100 ||
      bulletY < -100 ||
      bulletY > window.innerHeight + 100
    ) {
      bullet.remove();
      activeBullets.delete(bullet);
      return;
    }

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const destroyEnemy = (enemy: Enemy) => {
  clearInterval(enemy.shootInterval);
  clearInterval(enemy.moveInterval);
  enemy.element.classList.add('laser-enemy-destroyed');
  enemy.element.style.pointerEvents = 'none';
  enemy.element.style.transform = 'scale(1.4) rotate(360deg)';
  enemy.element.style.opacity = '0';
  setTimeout(() => enemy.element.remove(), 320);
  laserState.enemies = laserState.enemies.filter((entry) => entry !== enemy);
};

const handleEnemyClick = (enemy: Enemy) => (event: MouseEvent) => {
  event.stopPropagation();
  playLaserSound();
  createMuzzleFlash(event.clientX, event.clientY);
  addScore(25);

  enemy.health -= 10;
  enemy.element.style.filter = 'brightness(2)';
  setTimeout(() => {
    enemy.element.style.filter = '';
  }, 120);

  if (enemy.health <= 0) {
    destroyEnemy(enemy);
  }
};

const spawnEnemy = () => {
  if (!laserState.active) return;

  const enemyElement = document.createElement('div');
  enemyElement.className = 'laser-enemy';
  enemyElement.style.position = 'fixed';
  enemyElement.style.width = `${ENEMY_SIZE}px`;
  enemyElement.style.height = `${ENEMY_SIZE}px`;
  enemyElement.style.zIndex = '9999';
  enemyElement.style.transition =
    'transform 0.2s ease-out, opacity 0.3s ease-out, filter 0.2s';
  enemyElement.textContent = '👾';

  enemyElement.style.left = `${Math.random() * (window.innerWidth - ENEMY_SIZE)}px`;
  enemyElement.style.top = `${Math.random() * (window.innerHeight - ENEMY_SIZE)}px`;

  document.body.appendChild(enemyElement);

  const enemy: Enemy = {
    element: enemyElement,
    health: 40,
    shootInterval: 0,
    moveInterval: 0,
  };

  const velocity = {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
  };

  const moveEnemy = () => {
    const rect = enemyElement.getBoundingClientRect();
    let nextX = rect.left + velocity.x * 6;
    let nextY = rect.top + velocity.y * 6;

    if (nextX <= 0 || nextX >= window.innerWidth - ENEMY_SIZE) {
      velocity.x *= -1;
      nextX = Math.max(0, Math.min(nextX, window.innerWidth - ENEMY_SIZE));
    }

    if (nextY <= 0 || nextY >= window.innerHeight - ENEMY_SIZE) {
      velocity.y *= -1;
      nextY = Math.max(0, Math.min(nextY, window.innerHeight - ENEMY_SIZE));
    }

    enemyElement.style.left = `${nextX}px`;
    enemyElement.style.top = `${nextY}px`;
  };

  enemy.moveInterval = window.setInterval(moveEnemy, 20);
  enemy.shootInterval = window.setInterval(
    () => shootAtPlayer(enemy),
    1800 + Math.random() * 600
  );
  enemyElement.addEventListener('click', handleEnemyClick(enemy));

  laserState.enemies.push(enemy);
};

export const spawnEnemyWave = (count = 5) => {
  for (let i = 0; i < count; i += 1) {
    const timeout = window.setTimeout(() => {
      if (!laserState.active) return;
      spawnEnemy();
    }, i * 700);
    enemySpawnTimeouts.push(timeout);
  }
};

export const cleanupEnemies = () => {
  enemySpawnTimeouts.forEach((timeout) => window.clearTimeout(timeout));
  enemySpawnTimeouts.length = 0;

  laserState.enemies.forEach((enemy) => {
    clearInterval(enemy.shootInterval);
    clearInterval(enemy.moveInterval);
    enemy.element.remove();
  });

  activeBullets.forEach((bullet) => bullet.remove());
  activeBullets.clear();
  laserState.enemies = [];
};
