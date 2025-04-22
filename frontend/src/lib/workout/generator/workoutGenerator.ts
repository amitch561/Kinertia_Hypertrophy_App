
import type { Exercise, Workout } from '@/types/workout';
import type { WorkoutPlanOptions } from './types';
import { generateVolumeBasedWorkoutPlan } from './volumeBasedGenerator';
import { volumeLandmarks } from './volumeLandmarks';

export const generateWorkoutPlan = (
  exercises: Exercise[], 
  options: WorkoutPlanOptions
): Workout[] => {
  // Generate workout plan using the volume-based system
  return generateVolumeBasedWorkoutPlan(exercises, options);
};

// Re-export everything for backward compatibility
export { volumeLandmarks } from './volumeLandmarks';
export type { WorkoutPlanOptions } from './types';
export { isVolumeWithinRecommendedRange, getVolumeRecommendation } from './volumeHelpers';

