import { useCallback, useEffect } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (callback: () => void) => {
  const handleKonamiCode = useCallback(() => {
    let konamiIndex = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === KONAMI_CODE[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === KONAMI_CODE.length) {
          callback();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    return handleKeyDown;
  }, [callback]);

  useEffect(() => {
    const handler = handleKonamiCode();
    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [handleKonamiCode]);
};
