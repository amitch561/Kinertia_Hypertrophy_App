
import { volumeLandmarks } from './volumeLandmarks';
import { volumeRecommendations } from '../constants';

const getExperienceLevelMultiplier = (experience: string = 'beginner'): number => {
  switch (experience) {
    case 'beginner':
      return 0.8;  // Start with slightly lower volume
    case 'intermediate':
      return 1.0;  // Standard volume
    case 'advanced':
      return 1.2;  // Can handle more volume
    default:
      return 1.0;
  }
};

export const isVolumeWithinRecommendedRange = (
  muscleGroup: string,
  currentVolume: number,
  focusMuscleGroups: string[] = [],
  experience: string = 'beginner',
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate'
): { isWithinRange: boolean; isLow: boolean; isHigh: boolean } => {
  const experienceMultiplier = getExperienceLevelMultiplier(experience);
  const expLevel = (experience as 'beginner' | 'intermediate' | 'advanced') || 'beginner';
  
  // Get basic recommendation from volumeRecommendation
  const { min, moderate, max } = getVolumeRecommendation(
    muscleGroup, 
    focusMuscleGroups, 
    experience,
    volumeLevel
  );
  
  // Select the appropriate target based on volume level
  let targetVolume;
  switch (volumeLevel) {
    case 'minimum':
      targetVolume = min;
      break;
    case 'moderate':
      targetVolume = moderate;
      break;
    case 'maximum':
      targetVolume = max;
      break;
    default:
      targetVolume = moderate;
  }
  
  // Determine if the muscle group is a focus muscle
  const isFocusMuscle = focusMuscleGroups.includes(muscleGroup);
  
  // Set comparison thresholds based on volume level and focus status
  let minRecommended, maxRecommended;
  
  switch (volumeLevel) {
    case 'minimum':
      minRecommended = min;
      // If focus muscle and MEV, allow a small range above MEV
      maxRecommended = isFocusMuscle ? Math.min(min + 2, moderate) : min;
      break;
    case 'maximum':
      minRecommended = isFocusMuscle ? moderate : max; // Focus muscles can start from moderate
      maxRecommended = max;
      break;
    case 'moderate':
    default:
      minRecommended = moderate;
      // If focus muscle and moderate volume, allow up to MRV
      maxRecommended = isFocusMuscle ? max : moderate;
      break;
  }
  
  const isLow = currentVolume < minRecommended;
  const isHigh = currentVolume > maxRecommended;
  const isWithinRange = !isLow && !isHigh;
  
  return {
    isWithinRange,
    isLow,
    isHigh
  };
};

export const getVolumeRecommendation = (
  muscleGroup: string,
  focusMuscleGroups: string[] = [],
  experience: string = 'beginner',
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate'
): { min: number; moderate: number; max: number } => {
  const expLevel = (experience as 'beginner' | 'intermediate' | 'advanced') || 'beginner';
  
  // Initialize with default values if muscle group isn't in landmarks
  let min = 0, moderate = 0, max = 0;
  
  // Check if muscle group exists in volumeLandmarks
  if (volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks]?.[expLevel]) {
    const landmark = volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks][expLevel];
    min = landmark.minimum;
    moderate = landmark.moderate;
    max = landmark.maximum;
  } else {
    // Fallback to general recommendations
    min = volumeRecommendations.minimum[muscleGroup as keyof typeof volumeRecommendations.minimum] || 0;
    moderate = volumeRecommendations.moderate[muscleGroup as keyof typeof volumeRecommendations.moderate] || 0;
    max = volumeRecommendations.maximum[muscleGroup as keyof typeof volumeRecommendations.maximum] || 0;
  }
  
  // Apply focus muscle bonus if this muscle is in the focusMuscleGroups
  const isFocusMuscle = focusMuscleGroups.includes(muscleGroup);
  
  if (isFocusMuscle) {
    // Calculate focus bonus based on experience
    const focusBonus = experience === 'beginner' ? 1 : 
                      experience === 'intermediate' ? 2 : 3;
    
    // For chest, be extra conservative
    if (muscleGroup === 'chest') {
      // For chest, add a smaller moderate increase
      moderate = Math.min(moderate + 1, max - 1);
      
      // Only advanced lifters can exceed MRV for chest
      if (experience === 'advanced') {
        max = max + 1; // Smaller increase even for advanced
      }
    } else {
      // For non-advanced lifters, ensure we don't exceed MRV for any muscle
      if (experience !== 'advanced') {
        moderate = Math.min(moderate + Math.floor(focusBonus * 0.5), max - 1);
      } else {
        // Advanced lifters can exceed MRV slightly for non-chest muscles
        moderate = moderate + Math.floor(focusBonus * 0.5);
        max = max + focusBonus;
      }
    }
  }
  
  return { min, moderate, max };
};
