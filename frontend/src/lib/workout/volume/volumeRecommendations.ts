
import { volumeLandmarks } from '../generator/volumeLandmarks';
import { undertrainedSubGroups } from '../exercises/secondaryMuscleMap';

export const getVolumeRecommendations = (
  muscleGroup: string,
  focusMuscleGroups: string[] = [],
  experience: string = 'beginner',
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate'
) => {
  const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
  const isFocused = focusMuscleGroups.includes(muscleGroup);
  
  // Get base recommendations from landmarks
  const landmark = volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks]?.[expLevel] || {
    minimum: 8,
    moderate: 12,
    maximum: 16
  };

  let { minimum: min, moderate, maximum: max } = landmark;

  // Adjust volumes for focus muscles
  if (isFocused) {
    const focusBonus = expLevel === 'beginner' ? 1 : 
                      expLevel === 'intermediate' ? 2 : 3;
                      
    // For chest, be especially conservative
    if (muscleGroup === 'chest') {
      moderate += 1;
      // For chest, add at most 1-2 sets to max based on experience
      const maxAddition = expLevel === 'beginner' ? 1 : 2;
      max = Math.min(
        max + maxAddition, 
        volumeLandmarks.chest[expLevel].maximum + (expLevel === 'advanced' ? 1 : 0)
      );
    } else {
      // For other muscle groups, use normal focus bonus
      moderate += Math.floor(focusBonus * 0.75);
      max += focusBonus;
    }
  }

  return { min, moderate, max };
};

export const getTargetVolume = (
  muscleGroup: string,
  volumeLevel: 'minimum' | 'moderate' | 'maximum',
  recommendations: { min: number; moderate: number; max: number }
) => {
  switch (volumeLevel) {
    case 'minimum':
      return recommendations.min;
    case 'maximum':
      return recommendations.max;
    case 'moderate':
    default:
      return recommendations.moderate;
  }
};
