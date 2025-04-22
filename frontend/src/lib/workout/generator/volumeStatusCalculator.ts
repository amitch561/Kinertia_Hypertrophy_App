
import type { Exercise, CompletedWorkout } from '@/types/workout';
import { isVolumeWithinRecommendedRange, getVolumeRecommendation } from './volumeHelpers';
import { calculateWeeklyVolume } from '@/utils/workoutUtils';

export const calculateVolumeStatus = (
  exercises: Exercise[],
  completedWorkouts: CompletedWorkout[],
  selectedExercises: string[] = [],
  focusMuscleGroups: string[] = [],
  experience: string = 'beginner'
) => {
  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup)));
  
  return muscleGroups.map(muscleGroup => {
    const { min, moderate, max } = getVolumeRecommendation(
      muscleGroup,
      focusMuscleGroups,
      experience
    );
    
    // Pass only completedWorkouts to calculateWeeklyVolume, which should return volume for the specified muscle group
    const currentVolume = calculateWeeklyVolume(completedWorkouts, muscleGroup);
    
    // Now use the currentVolume number with isVolumeWithinRecommendedRange
    const { isLow, isHigh } = isVolumeWithinRecommendedRange(
      muscleGroup,
      currentVolume,
      focusMuscleGroups,
      experience
    );
    
    return {
      muscleGroup,
      current: currentVolume,
      min,
      moderate,
      max,
      isLow,
      isHigh
    };
  });
};
