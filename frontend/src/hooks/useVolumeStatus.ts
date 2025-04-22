
import { useMemo } from 'react';

interface VolumeStatusItemData {
  muscleGroup: string;
  current: number;
  min: number;
  moderate: number;
  max: number;
  targetVolume: number;
  isFocused: boolean;
  statusColor: string;
  progressColor: string;
  isLow: boolean;
  isHigh: boolean;
}

export const useVolumeStatus = (
  status: {
    muscleGroup: string;
    current: number;
    min: number;
    moderate: number;
    max: number;
    isLow: boolean;
    isHigh: boolean;
  }[],
  focusMuscleGroups: string[] = [],
  volumeLevel: "minimum" | "moderate" | "maximum" = "moderate"
) => {
  const volumeStatusData = useMemo(() => {
    return status.map(status => {
      const targetVolume = volumeLevel === 'minimum' ? status.min : 
                          volumeLevel === 'maximum' ? status.max : 
                          status.moderate;

      const isFocused = focusMuscleGroups.includes(status.muscleGroup);
      const exceedsMRV = status.current > status.max;
      const exceedsTarget = status.current > targetVolume;
      const isExactlyOnTarget = status.current === targetVolume;
      
      // Status color logic
      let statusColor = "text-blue-500"; // Default: below target
      if (isExactlyOnTarget) {
        statusColor = "text-green-500";
      } else if (exceedsMRV) {
        statusColor = isFocused ? "text-red-500" : "text-yellow-500";
      } else if (exceedsTarget) {
        statusColor = isFocused ? "text-blue-500" : "text-yellow-500";
      }
      
      // Progress bar color logic
      let progressColor = "bg-blue-500"; // Default: below target
      if (isExactlyOnTarget) {
        progressColor = "bg-green-500";
      } else if (exceedsMRV) {
        progressColor = isFocused ? "bg-red-500" : "bg-yellow-500";
      } else if (exceedsTarget) {
        progressColor = isFocused ? "bg-blue-500" : "bg-yellow-500";
      }

      return {
        muscleGroup: status.muscleGroup,
        current: status.current,
        min: status.min,
        moderate: status.moderate,
        max: status.max,
        targetVolume,
        isFocused,
        statusColor,
        progressColor,
        isLow: status.current < targetVolume,
        isHigh: exceedsTarget
      };
    });
  }, [status, focusMuscleGroups, volumeLevel]);

  // Warning flags
  const hasLowVolume = status.some(s => {
    const targetVolume = volumeLevel === 'minimum' ? s.min : 
                        volumeLevel === 'maximum' ? s.max : 
                        s.moderate;
    return s.current < targetVolume;
  });
  
  const hasHighVolumeNoFocus = status.some(s => {
    const targetVolume = volumeLevel === 'minimum' ? s.min : 
                        volumeLevel === 'maximum' ? s.max : 
                        s.moderate;
    return s.current > targetVolume && !focusMuscleGroups.includes(s.muscleGroup);
  });
  
  const hasExceededMRV = status.some(s => 
    s.current > s.max && focusMuscleGroups.includes(s.muscleGroup)
  );

  return {
    volumeStatusData,
    hasLowVolume,
    hasHighVolumeNoFocus,
    hasExceededMRV
  };
};
