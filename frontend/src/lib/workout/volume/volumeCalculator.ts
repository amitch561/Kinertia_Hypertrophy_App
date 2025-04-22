
import { getVolumeRecommendations, getTargetVolume } from './volumeRecommendations';
import type { VolumeStatus } from '@/types/workout';

export const calculateVolumeStatus = (
  status: {
    muscleGroup: string;
    current: number;
    min: number;
    moderate: number;
    max: number;
  }[],
  focusMuscleGroups: string[] = [],
  experience: string = 'beginner',
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate',
  subgroupHistory?: Record<string, { weeksUnderMEV: number; lastWeekTrained: number }>
): VolumeStatus[] => {
  return status.map(status => {
    const { min, moderate, max } = getVolumeRecommendations(
      status.muscleGroup,
      focusMuscleGroups,
      experience,
      volumeLevel
    );

    const targetVolume = getTargetVolume(status.muscleGroup, volumeLevel, { min, moderate, max });
    const isFocused = focusMuscleGroups.includes(status.muscleGroup);
    const exceedsMRV = status.current > max;
    const isHigh = status.current > targetVolume;
    const isLow = status.current < targetVolume;

    // Color logic for status text
    let statusColor = "text-green-500";
    if (status.current < min) {
      statusColor = "text-yellow-500";
    } else if (exceedsMRV) {
      statusColor = "text-red-500";
    } else if (isHigh && !isFocused) {
      statusColor = focusMuscleGroups.length === 0 ? "text-red-500" : "text-orange-500";
    }

    // Color logic for progress bar
    let progressColor = "bg-green-500"; // MEV
    if (status.current <= min) {
      progressColor = "bg-green-500"; // MEV color
    } else if (status.current <= moderate) {
      progressColor = "bg-blue-500"; // Moderate color
    } else if (status.current <= max) {
      progressColor = "bg-orange-500"; // MRV color
    } else {
      progressColor = "bg-red-500"; // Exceeding MRV color
    }

    return {
      muscleGroup: status.muscleGroup,
      current: status.current,
      min,
      moderate,
      max,
      targetVolume,
      isFocused,
      statusColor,
      progressColor,
      isLow,
      isHigh
    };
  });
};
