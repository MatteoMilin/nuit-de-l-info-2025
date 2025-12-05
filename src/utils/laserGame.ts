import gunCursor from '../assets/gun.png';

let isLaserGameActive = false;
let score = 0;
let health = 100;
let scoreDisplay: HTMLDivElement | null = null;
let healthBarFill: HTMLDivElement | null = null;
let shootSound: HTMLAudioElement | null = null;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let enemies: Array<{
  element: HTMLElement;
  health: number;
  shootInterval: number;
}> = [];

const scoreText = (points: number) => `La zerguèm: ${points} points`;

const damagePlayer = (amount: number) => {
  health = Math.max(0, health - amount);
  if (healthBarFill) {
    healthBarFill.style.width = `${health}%`;
    healthBarFill.style.background =
      health > 50
        ? 'linear-gradient(90deg, #00ff00, #88ff00)'
        : health > 25
          ? 'linear-gradient(90deg, #ffff00, #ff8800)'
          : 'linear-gradient(90deg, #ff0000, #cc0000)';
  }

  if (health <= 0) {
    gameOver();
  }
};

const gameOver = () => {
  const gameOverDiv = document.createElement('div');
  gameOverDiv.style.position = 'fixed';
  gameOverDiv.style.top = '50%';
  gameOverDiv.style.left = '50%';
  gameOverDiv.style.transform = 'translate(-50%, -50%)';
  gameOverDiv.style.fontSize = '64px';
  gameOverDiv.style.fontWeight = 'bold';
  gameOverDiv.style.color = '#ff0000';
  gameOverDiv.style.zIndex = '999999';
  gameOverDiv.style.textAlign = 'center';
  gameOverDiv.style.textShadow = '0 0 20px #ff0000, 0 0 40px #ff0000';
  gameOverDiv.style.fontFamily = 'Minecraft, sans-serif';
  gameOverDiv.innerHTML = `
    GAME OVER<br>
    <span style="font-size: 32px;">Score final: ${score}</span>
  `;
  document.body.appendChild(gameOverDiv);

  // Arrêter tous les ennemis
  enemies.forEach((enemy) => {
    clearInterval(enemy.shootInterval);
  });
};

export const activateLaserGame = () => {
  if (isLaserGameActive) return;

  isLaserGameActive = true;
  score = 0;
  health = 100;

  const style = document.createElement('style');
  style.id = 'laser-game-cursor';
  style.textContent = `
    * {
      cursor: url('${gunCursor}') 16 16, crosshair !important;
    }
  `;
  document.head.appendChild(style);

  scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'laser-game-score';
  scoreDisplay.style.position = 'fixed';
  scoreDisplay.style.top = '20px';
  scoreDisplay.style.left = '20px';
  scoreDisplay.style.fontSize = '32px';
  scoreDisplay.style.fontWeight = 'bold';
  scoreDisplay.style.color = '#ff0000';
  scoreDisplay.style.zIndex = '99999';
  scoreDisplay.style.textShadow = '0 0 10px #ff0000, 0 0 20px #ff0000';
  scoreDisplay.style.fontFamily = 'Minecraft, sans-serif';
  scoreDisplay.textContent = scoreText(score);
  document.body.appendChild(scoreDisplay);

  const healthBarContainer = document.createElement('div');
  healthBarContainer.id = 'health-bar-container';
  healthBarContainer.style.position = 'fixed';
  healthBarContainer.style.top = '70px';
  healthBarContainer.style.left = '20px';
  healthBarContainer.style.width = '300px';
  healthBarContainer.style.height = '30px';
  healthBarContainer.style.background = 'rgba(0, 0, 0, 0.5)';
  healthBarContainer.style.border = '3px solid #fff';
  healthBarContainer.style.borderRadius = '5px';
  healthBarContainer.style.zIndex = '99999';
  healthBarContainer.style.overflow = 'hidden';
  document.body.appendChild(healthBarContainer);

  healthBarFill = document.createElement('div');
  healthBarFill.id = 'health-bar-fill';
  healthBarFill.style.width = '100%';
  healthBarFill.style.height = '100%';
  healthBarFill.style.background = 'linear-gradient(90deg, #00ff00, #88ff00)';
  healthBarFill.style.transition = 'width 0.3s, background 0.3s';
  healthBarContainer.appendChild(healthBarFill);

  const healthText = document.createElement('div');
  healthText.style.position = 'fixed';
  healthText.style.top = '105px';
  healthText.style.left = '20px';
  healthText.style.fontSize = '18px';
  healthText.style.fontWeight = 'bold';
  healthText.style.color = '#ffffff';
  healthText.style.zIndex = '99999';
  healthText.style.fontFamily = 'Minecraft, sans-serif';
  healthText.textContent = '❤️ Points de vie';
  document.body.appendChild(healthText);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  shootSound = new Audio('/src/assets/sounds/shoot.wav');
  shootSound.volume = 0.3;

  const spawnEnemies = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const enemy = document.createElement('div');
        enemy.className = 'laser-enemy';
        enemy.style.position = 'fixed';
        enemy.style.width = '80px';
        enemy.style.height = '80px';
        enemy.style.background = 'linear-gradient(135deg, #ff0000, #8800ff)';
        enemy.style.border = '3px solid #ffff00';
        enemy.style.borderRadius = '10px';
        enemy.style.display = 'flex';
        enemy.style.alignItems = 'center';
        enemy.style.justifyContent = 'center';
        enemy.style.fontSize = '40px';
        enemy.style.cursor = 'crosshair';
        enemy.style.transition = 'transform 0.3s';
        enemy.style.zIndex = '9999';
        enemy.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
        enemy.textContent = '👾';

        enemy.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
        enemy.style.top = `${Math.random() * (window.innerHeight - 100)}px`;

        document.body.appendChild(enemy);

        const enemyData = {
          element: enemy,
          health: 30,
          shootInterval: 0,
        };

        let moveX = (Math.random() - 0.5) * 2;
        let moveY = (Math.random() - 0.5) * 2;

        const moveEnemy = () => {
          const rect = enemy.getBoundingClientRect();
          const newLeft = rect.left + moveX;
          const newTop = rect.top + moveY;

          if (newLeft <= 0 || newLeft >= window.innerWidth - 80) {
            moveX *= -1;
          }
          if (newTop <= 0 || newTop >= window.innerHeight - 80) {
            moveY *= -1;
          }

          enemy.style.left = `${Math.max(0, Math.min(newLeft, window.innerWidth - 80))}px`;
          enemy.style.top = `${Math.max(0, Math.min(newTop, window.innerHeight - 80))}px`;
        };

        const moveInterval = setInterval(moveEnemy, 20);

        enemyData.shootInterval = window.setInterval(() => {
          if (health <= 0) return;

          const enemyRect = enemy.getBoundingClientRect();
          const bullet = document.createElement('div');
          bullet.className = 'enemy-bullet';
          bullet.style.position = 'fixed';
          bullet.style.left = `${enemyRect.left + 40}px`;
          bullet.style.top = `${enemyRect.top + 40}px`;
          bullet.style.width = '15px';
          bullet.style.height = '15px';
          bullet.style.borderRadius = '50%';
          bullet.style.background = 'radial-gradient(circle, #ff0000, #cc0000)';
          bullet.style.boxShadow = '0 0 15px #ff0000, 0 0 30px #ff0000';
          bullet.style.zIndex = '9997';
          bullet.style.pointerEvents = 'none';
          document.body.appendChild(bullet);

          const targetX = mouseX;
          const targetY = mouseY;
          const deltaX = targetX - (enemyRect.left + 40);
          const deltaY = targetY - (enemyRect.top + 40);
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const speed = 6;
          const vx = (deltaX / distance) * speed;
          const vy = (deltaY / distance) * speed;

          let bulletX = enemyRect.left + 40;
          let bulletY = enemyRect.top + 40;
          let bulletActive = true;

          const moveBullet = () => {
            if (!bulletActive) return;

            bulletX += vx;
            bulletY += vy;
            bullet.style.left = `${bulletX}px`;
            bullet.style.top = `${bulletY}px`;

            const distToCursor = Math.sqrt(
              Math.pow(bulletX - mouseX, 2) + Math.pow(bulletY - mouseY, 2)
            );

            if (distToCursor < 50) {
              damagePlayer(5);
              bulletActive = false;

              bullet.style.transform = 'scale(3)';
              bullet.style.opacity = '0';
              setTimeout(() => bullet.remove(), 200);

              const damageOverlay = document.createElement('div');
              damageOverlay.style.position = 'fixed';
              damageOverlay.style.inset = '0';
              damageOverlay.style.background = 'rgba(255, 0, 0, 0.3)';
              damageOverlay.style.zIndex = '99997';
              damageOverlay.style.pointerEvents = 'none';
              document.body.appendChild(damageOverlay);

              setTimeout(() => damageOverlay.remove(), 100);
            } else if (
              bulletX < -50 ||
              bulletX > window.innerWidth + 50 ||
              bulletY < -50 ||
              bulletY > window.innerHeight + 50
            ) {
              bulletActive = false;
              bullet.remove();
            } else {
              requestAnimationFrame(moveBullet);
            }
          };

          requestAnimationFrame(moveBullet);
        }, 2000) as unknown as number;

        enemy.addEventListener('click', (e) => {
          e.stopPropagation();

          enemyData.health -= 10;
          score += 20;
          if (scoreDisplay) {
            scoreDisplay.textContent = scoreText(score);
          }

          enemy.style.filter = 'brightness(2)';
          setTimeout(() => {
            enemy.style.filter = '';
          }, 100);

          if (enemyData.health <= 0) {
            clearInterval(enemyData.shootInterval);
            clearInterval(moveInterval);

            enemy.style.transform = 'scale(1.5) rotate(360deg)';
            enemy.style.opacity = '0';
            setTimeout(() => {
              enemy.remove();
            }, 300);

            enemies = enemies.filter((e) => e !== enemyData);
          }
        });

        enemies.push(enemyData);
      }, i * 1000);
    }
  };

  spawnEnemies();

  const elements = document.querySelectorAll('*');

  elements.forEach((el) => {
    const element = el as HTMLElement;

    if (
      element === document.body ||
      element === document.documentElement ||
      element.tagName === 'SCRIPT' ||
      element.tagName === 'STYLE' ||
      element.tagName === 'META' ||
      element.tagName === 'LINK' ||
      element.tagName === 'HEAD' ||
      element.id === 'laser-game-score' ||
      element.classList.contains('laser-target')
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    element.classList.add('laser-target');
    element.style.cursor = 'crosshair';
    element.style.transition = 'all 0.1s';

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const muzzleFlash = document.createElement('div');
      muzzleFlash.style.position = 'fixed';
      muzzleFlash.style.left = `${e.clientX}px`;
      muzzleFlash.style.top = `${e.clientY}px`;
      muzzleFlash.style.width = '40px';
      muzzleFlash.style.height = '40px';
      muzzleFlash.style.borderRadius = '50%';
      muzzleFlash.style.background =
        'radial-gradient(circle, #ffff00 0%, #ff6600 40%, #ff0000 70%, transparent 100%)';
      muzzleFlash.style.transform = 'translate(-50%, -50%)';
      muzzleFlash.style.pointerEvents = 'none';
      muzzleFlash.style.zIndex = '99998';
      muzzleFlash.style.boxShadow = '0 0 20px #ffff00, 0 0 40px #ff6600';
      document.body.appendChild(muzzleFlash);

      let opacity = 1;
      let scale = 1;
      const animate = () => {
        opacity -= 0.1;
        scale += 0.3;
        muzzleFlash.style.opacity = opacity.toString();
        muzzleFlash.style.transform = `translate(-50%, -50%) scale(${scale})`;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          muzzleFlash.remove();
        }
      };
      requestAnimationFrame(animate);

      if (shootSound) {
        shootSound.currentTime = 0;
        shootSound.play().catch(() => {});
      }

      score += 10;
      if (scoreDisplay) {
        scoreDisplay.textContent = scoreText(score);
      }

      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);

      const clone = element.cloneNode(true) as HTMLElement;

      clone.style.cssText = computedStyle.cssText;

      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.margin = '0';
      clone.style.padding = computedStyle.padding;
      clone.style.border = computedStyle.border;
      clone.style.transform = computedStyle.transform;
      clone.style.zIndex = '9998';
      clone.style.pointerEvents = 'none';
      clone.style.transition = 'none';
      clone.style.animation = 'none';

      clone.style.filter = 'brightness(2) saturate(0)';

      document.body.appendChild(clone);

      element.style.visibility = 'hidden';
      element.style.pointerEvents = 'none';
      element.classList.remove('laser-target');

      let currentTop = rect.top;
      let currentLeft = rect.left;
      let currentRotation = 0;
      let velocity = 0;
      const velocityX = (Math.random() - 0.5) * 5;
      const gravity = 0.8;
      const rotationSpeed = (Math.random() - 0.5) * 20;

      const fall = () => {
        velocity += gravity;
        currentTop += velocity;
        currentLeft += velocityX;
        currentRotation += rotationSpeed;

        clone.style.top = `${currentTop}px`;
        clone.style.left = `${currentLeft}px`;
        clone.style.transform = `rotate(${currentRotation}deg)`;
        clone.style.opacity = `${Math.max(0, 1 - currentTop / window.innerHeight)}`;

        if (currentTop < window.innerHeight + 200) {
          requestAnimationFrame(fall);
        } else {
          clone.remove();
          element.remove();
        }
      };

      fall();
    };

    element.addEventListener('click', handleClick);
  });

  if (!document.getElementById('laser-game-styles')) {
    const style = document.createElement('style');
    style.id = 'laser-game-styles';
    style.textContent = `
      .laser-target:hover {
        filter: brightness(1.2) drop-shadow(0 0 5px red);
      }
    `;
    document.head.appendChild(style);
  }
};
