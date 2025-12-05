import laserSound from '../assets/sounds/shoot.wav';

let audioElement: HTMLAudioElement | null = null;

export const initAudio = () => {
  audioElement = new Audio(laserSound);
  audioElement.volume = 0.4;
};

export const playLaserSound = () => {
  if (!audioElement) {
    initAudio();
  }
  if (!audioElement) return;
  audioElement.currentTime = 0;
  void audioElement.play();
};

export const cleanupAudio = () => {
  audioElement?.pause();
  audioElement = null;
};
