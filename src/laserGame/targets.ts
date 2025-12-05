import { playLaserSound } from './audio';
import { createMuzzleFlash } from './effects';
import { addScore } from './mechanics';

const disallowedTags = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'HEAD']);
const excludedSelectors = [
  'laser-game-score',
  'laser-game-overlay',
  'laser-health-bar',
];

const excludedClasses = new Set([
  'laser-hud',
  'laser-score',
  'laser-health-bar',
  'laser-health-fill',
  'laser-health-label',
  'laser-enemy',
  'enemy-bullet',
  'laser-retro-flash',
  'laser-game-damage-overlay',
  'laser-game-over',
]);

const targetHandlers = new Map<HTMLElement, (event: MouseEvent) => void>();

const shouldSkipElement = (element: HTMLElement) => {
  if (disallowedTags.has(element.tagName)) return true;
  if (element === document.body || element === document.documentElement)
    return true;
  if (excludedSelectors.includes(element.id)) return true;
  if ([...excludedClasses].some((cls) => element.classList.contains(cls)))
    return true;
  if (element.closest('.laser-hud')) return true;
  if (element.dataset.laserTarget === 'bound') return true;

  const rect = element.getBoundingClientRect();
  return rect.width === 0 || rect.height === 0;
};

const createFallingClone = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const computed = window.getComputedStyle(element);

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.cssText = computed.cssText;
  clone.style.position = 'fixed';
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = '0';
  clone.style.padding = computed.padding;
  clone.style.border = computed.border;
  clone.style.transform = computed.transform;
  clone.style.zIndex = '9998';
  clone.style.pointerEvents = 'none';
  clone.style.transition = 'none';
  clone.style.animation = 'none';
  clone.style.filter = 'brightness(2) saturate(0)';

  document.body.appendChild(clone);

  let currentTop = rect.top;
  let currentLeft = rect.left;
  let currentRotation = 0;
  let velocityY = 0;
  const velocityX = (Math.random() - 0.5) * 4;
  const gravity = 0.8;
  const rotationSpeed = (Math.random() - 0.5) * 18;

  const fall = () => {
    velocityY += gravity;
    currentTop += velocityY;
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
    }
  };

  requestAnimationFrame(fall);
};

const createHandler = (element: HTMLElement) => (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();

  createMuzzleFlash(event.clientX, event.clientY);
  playLaserSound();
  addScore(10);

  element.dataset.laserTarget = 'destroyed';
  element.style.visibility = 'hidden';
  element.style.pointerEvents = 'none';
  element.classList.remove('laser-target');

  createFallingClone(element);
};

export const attachLaserTargets = () => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('*'));

  elements.forEach((element) => {
    if (shouldSkipElement(element)) return;

    const handler = createHandler(element);
    element.dataset.laserTarget = 'bound';
    element.classList.add('laser-target');
    element.addEventListener('click', handler);
    targetHandlers.set(element, handler);
  });
};

export const cleanupTargets = () => {
  targetHandlers.forEach((handler, element) => {
    const targetState = element.dataset.laserTarget;
    element.removeEventListener('click', handler);
    element.classList.remove('laser-target');
    if (targetState === 'destroyed') {
      element.style.visibility = '';
      element.style.pointerEvents = '';
    }
    if (targetState) {
      delete element.dataset.laserTarget;
    }
  });
  targetHandlers.clear();
};
