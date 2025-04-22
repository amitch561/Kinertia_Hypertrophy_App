
import type { Workout, VolumeStatus, CompletedWorkout } from '@/types/workout';
import { calculateWeeklyVolume } from '@/utils/workoutUtils';
import { isVolumeWithinRecommendedRange, getVolumeRecommendation } from '@/lib/workout/generator/volumeHelpers';
import { volumeRecommendations } from '@/lib/workout/constants';
import { volumeLandmarks } from '@/lib/workout/generator/volumeLandmarks';

export const useVolumeCalculations = (workoutPlan: Workout[], selectedExercises: string[] = [], focusMuscleGroups: string[] = [], experience: string = 'beginner') => {
  const calculateCurrentVolumeStatus = (): VolumeStatus[] => {
    if (!workoutPlan || workoutPlan.length === 0) {
      return [];
    }
    
    // Initialize volumes for muscle groups
    const muscleGroups = [
      'chest', 'back', 'shoulders', 'biceps', 'triceps', 
      'quads', 'hamstrings', 'glutes', 'calves', 'core'
    ];
    
    return muscleGroups.map(muscleGroup => {
      // Initialize current volume to 0
      let current = 0;
      
      // Calculate volume from workouts in the plan using a more accurate method
      workoutPlan.forEach(workout => {
        workout.exercises.forEach(exercise => {
          // More specific and accurate muscle group matching
          const muscleFromExerciseId = exercise.exerciseId.split('_')[0]; // Extract the muscle group prefix
          
          if (muscleFromExerciseId === muscleGroup) {
            // Count non-warmup sets
            current += exercise.sets.filter(set => !set.isWarmUp).length;
          }
        });
      });
      
      // Volume from selected exercises calculation
      let selectedVolume = 0;
      if (selectedExercises.length > 0) {
        // Find exact exercises for this muscle group by extracting the muscle prefix
        const exercisesForMuscle = selectedExercises.filter(id => {
          const musclePrefix = id.split('_')[0];
          return musclePrefix === muscleGroup;
        });
        
        // Default to 3 working sets per selected exercise
        selectedVolume = exercisesForMuscle.length * 3;
      }
      
      // Get volume recommendations based on experience and focus
      let { min, moderate, max } = getVolumeRecommendation(muscleGroup, focusMuscleGroups, experience);
      
      // Apply the MRV cap for all muscle groups, not just chest
      const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
      
      // If this muscle group exists in volumeLandmarks, ensure we don't exceed MRV
      if (volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks]?.[expLevel]) {
        const maxSets = volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks][expLevel].maximum;
        
        // Ensure max doesn't exceed the landmark maximum
        max = Math.min(max, maxSets);
        
        // Cap the total volume (current + selected) at MRV
        if (current + selectedVolume > maxSets) {
          selectedVolume = Math.max(0, maxSets - current);
        }
      }
      
      // Add the (potentially capped) selected volume to current
      current += selectedVolume;
      
      // Check if volume is within recommended range
      const { isLow, isHigh } = isVolumeWithinRecommendedRange(muscleGroup, current, focusMuscleGroups, experience);
      
      return {
        muscleGroup,
        current,
        min,
        moderate,
        max,
        isLow,
        isHigh
      };
    });
  };

  return {
    calculateCurrentVolumeStatus,
  };
};
