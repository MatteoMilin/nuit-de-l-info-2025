import gunCursor from '../assets/gun.png';

let isLaserGameActive = false;
let score = 0;
let scoreDisplay: HTMLDivElement | null = null;
let shootSound: HTMLAudioElement | null = null;

const scoreText = (points: number) => `La zerguèm: ${points} points`;

export const activateLaserGame = () => {
  if (isLaserGameActive) return;

  isLaserGameActive = true;
  score = 0;

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

  shootSound = new Audio('/src/assets/sounds/shoot.wav');
  shootSound.volume = 0.3;

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
