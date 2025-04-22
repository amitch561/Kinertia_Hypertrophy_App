import type { Exercise } from '@/types/workout';
import { getSubGroupId } from '@/lib/workout/exercises/exerciseUtils';
import { getRecommendedExercises } from '@/utils/exerciseRecommendations';

// Map of exercises that impact other muscle groups
const secondaryMuscleMap: Record<string, string[]> = {
  // Chest movements impact front delts
  "incline_dumbbell_press": ["shoulders"],
  "incline_barbell_bench_press": ["shoulders"],
  "flat_dumbbell_bench_press": ["shoulders", "triceps"],
  "flat_barbell_bench_press": ["shoulders", "triceps"],
  "decline_bench_press": ["shoulders", "triceps"],
  "dumbbell_flyes": ["shoulders"],
  
  // Row movements impact biceps
  "bent_over_row": ["biceps"],
  "seated_cable_row": ["biceps"],
  "t_bar_row": ["biceps"],
  "pendlay_row": ["biceps"],
  
  // Pressing movements impact triceps
  "overhead_press": ["triceps"],
  "military_press": ["triceps"],
  "push_press": ["triceps"],
  
  // Pull-ups/pull-downs impact biceps
  "pull_ups": ["biceps"],
  "chin_ups": ["biceps"],
  "lat_pulldown": ["biceps"],
  
  // Compound lower body movements
  "barbell_squat": ["lower_back", "hamstrings"],
  "deadlift": ["lower_back", "glutes"],
  "romanian_deadlift": ["lower_back", "glutes"],
  "leg_press": ["hamstrings", "glutes"]
};

export const selectExercisesForMuscle = (
  exercisePool: Exercise[],
  muscleGroup: string,
  experience: string,
  volumeLevel: string,
  selectedExercises: string[] = [],
  focusMuscleGroups: string[] = []
): Exercise[] => {
  // Check if this muscle group is focused
  const isFocused = focusMuscleGroups.includes(muscleGroup);
  let selected: Exercise[] = [];
  
  // For beginners with minimum volume, use recommended exercises
  if (experience === 'beginner' && volumeLevel === 'minimum') {
    const recommended = getRecommendedExercises(muscleGroup, volumeLevel);
    if (recommended.length > 0) {
      const recommendedExercises = exercisePool.filter(e => 
        recommended.includes(e.id)
      );
      if (recommendedExercises.length > 0) {
        return recommendedExercises;
      }
    }
  }
  
  // If we have user-selected exercises, prioritize those
  if (selectedExercises.length > 0) {
    selected = exercisePool.filter(e => selectedExercises.includes(e.id));
    if (selected.length > 0) {
      return selected;
    }
  }
  
  // If this is a focused muscle group, return all exercises
  if (isFocused) {
    return exercisePool;
  }
  
  // Check if other selected exercises would hit this muscle group as a secondary effect
  if (selectedExercises.length > 0) {
    const selectedExercisesData = exercisePool.filter(e => selectedExercises.includes(e.id));
    
    // Count how many times this muscle group is hit as a secondary
    let secondaryImpactCount = 0;
    selectedExercisesData.forEach(exercise => {
      const secondaryMuscles = secondaryMuscleMap[exercise.id] || [];
      if (secondaryMuscles.includes(muscleGroup)) {
        secondaryImpactCount++;
      }
    });
    
    // Special handling for front delts if chest is selected
    if (muscleGroup === 'shoulders') {
      const hasChestExercises = selectedExercisesData.some(ex => ex.muscleGroup === 'chest');
      
      if (hasChestExercises) {
        // Filter out front delt exercises
        return exercisePool.filter(e => 
          getSubGroupId(e) !== 'front' && e.name.toLowerCase().indexOf('front') === -1
        );
      }
    }
    
    // If this is already hit hard as a secondary muscle, prioritize different exercises
    if (secondaryImpactCount >= 2) {
      // Filter to focus on parts less affected by compound movements
      return exercisePool.filter(e => 
        getSubGroupId(e) === 'lateral' || getSubGroupId(e) === 'rear' || 
        e.name.toLowerCase().includes('isolation')
      );
    }
  }
  
  return exercisePool;
};
