
export const adjustVolumeBasedOnRecovery = (
  currentVolume: number,
  recoveryScore: number,
  isDeloadWeek: boolean,
  minVolume: number,
  maxVolume: number
): number => {
  if (isDeloadWeek) {
    return Math.floor(currentVolume * 0.5); // Deload reduces volume by ~50%
  }
  
  if (recoveryScore >= 4 && currentVolume < maxVolume) {
    return currentVolume + 1;
  } else if (recoveryScore <= 2 && currentVolume > minVolume) {
    return currentVolume - 1;
  }
  
  return currentVolume;
};
