
import type { Exercise, CompletedWorkout } from "@/types/workout";
import { calculateVolumeStatus } from "@/lib/workout/volume/volumeCalculator";
import { volumeLandmarks } from "@/lib/workout/generator/volumeLandmarks";

export const calculateCurrentVolumeStatus = (
  exercises: Exercise[],
  completedWorkouts: CompletedWorkout[],
  selectedExercises: string[] = [],
  focusMuscleGroups: string[] = [],
  experience: string = 'beginner',
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate',
  subgroupHistory?: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>
) => {
  // Get all unique muscle groups from exercises
  const muscleGroups = [...new Set(exercises.map(ex => ex.muscleGroup))];
  
  return muscleGroups.map(muscleGroup => {
    // Count sets from completed workouts in the current week
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    
    const currentWeekCompleted = completedWorkouts.filter(w => 
      new Date(w.date) >= currentWeekStart
    );

    // Calculate current volume from completed workouts (non-warmup sets only)
    let current = 0;
    currentWeekCompleted.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const exerciseDetails = exercises.find(ex => ex.id === exercise.exerciseId);
        if (exerciseDetails?.muscleGroup === muscleGroup) {
          current += exercise.sets.filter(set => !set.isWarmUp && set.completed).length;
        }
      });
    });

    // Get volume targets from landmarks based on experience
    const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
    const isFocused = focusMuscleGroups.includes(muscleGroup);
    
    // Default landmark values if not defined for this muscle group
    let min = 4, moderate = 8, max = 12;
    
    // Get landmark values if they exist for this muscle group
    if (muscleGroup in volumeLandmarks) {
      const landmarks = volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks][expLevel];
      min = landmarks.minimum;
      moderate = landmarks.moderate;
      max = landmarks.maximum;
      
      // Apply focus bonus for focus muscle groups
      if (isFocused) {
        // For focus muscles, increase target but respect MRV
        if (muscleGroup === 'chest') {
          // Special case for chest - conservative approach
          moderate += 1;
          max = Math.min(max + (expLevel === 'beginner' ? 1 : 2), landmarks.maximum + (expLevel === 'advanced' ? 1 : 0));
        } else {
          // For other muscle groups
          const focusBonus = expLevel === 'beginner' ? 1 : (expLevel === 'intermediate' ? 2 : 3);
          moderate += Math.floor(focusBonus * 0.75);
          max += focusBonus;
        }
      }
    }

    // Handle selected exercises volume with proper capping
    if (selectedExercises.length > 0) {
      const exercisesForMuscle = selectedExercises.filter(id => {
        const exercise = exercises.find(ex => ex.id === id);
        return exercise?.muscleGroup === muscleGroup;
      });
      
      const targetVolume = volumeLevel === 'minimum' ? min : 
                          volumeLevel === 'maximum' ? max : 
                          moderate;
      
      const setsPerExercise = 3;
      
      // Calculate sets to add with proper capping
      let setsToAdd = exercisesForMuscle.length * setsPerExercise;
      
      // Simplified capping logic
      setsToAdd = Math.min(setsToAdd, isFocused ? max - current : targetVolume - current);
      setsToAdd = Math.max(0, setsToAdd); // Prevent negative values
      
      current += setsToAdd;
      
      console.log(`${muscleGroup}: Added ${setsToAdd} sets (Focus: ${isFocused}, Target: ${targetVolume}, Max: ${max})`);
    }

    // Calculate if volume is low or high compared to target
    const targetVolume = volumeLevel === 'minimum' ? min : 
                        volumeLevel === 'maximum' ? max : 
                        moderate;
    
    const isLow = current < targetVolume;
    const isHigh = isFocused ? current > max : current > targetVolume;

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
