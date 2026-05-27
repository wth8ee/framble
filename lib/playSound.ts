export const playSound = (name: string, volume: number = 0.5) => {
  const audio = new Audio(`/sounds/${name}`);
  audio.volume = volume;
  audio.play().catch((error) => {
    console.error("Ошибка воспроизведения:", error);
  });
};
