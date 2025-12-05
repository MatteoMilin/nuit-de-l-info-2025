export const createMuzzleFlash = (x: number, y: number) => {
  const flash = document.createElement('div');
  flash.className = 'laser-retro-flash';
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  flash.style.transform = 'translate(-50%, -50%) scale(0.6)';
  flash.style.zIndex = '99998';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 200);
};

export const flashDamageOverlay = () => {
  const overlay = document.createElement('div');
  overlay.className = 'laser-game-damage-overlay';
  overlay.style.zIndex = '99997';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 200);
};
