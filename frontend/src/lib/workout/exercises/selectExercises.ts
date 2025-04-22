
import type { Exercise } from '@/types/workout';
import { getRecommendedExercises } from '@/utils/exerciseRecommendations';
import { shouldRecommendExercise } from './exerciseFilters';

interface ExerciseSelectionResult {
  exercises: Exercise[];
  setsPerExercise: Record<string, number>;
}

export const selectExercisesForDay = (
  exercises: Exercise[],
  muscleGroups: string[],
  equipment: string[],
  experience: string,
  volumeLevel: 'minimum' | 'moderate' | 'maximum',
  trainingGoal: string = 'hypertrophy',
  priorityMuscles: string[] = [],
  selectedExercises: string[] = []
): ExerciseSelectionResult => {
  const selectedExercisesResult: Exercise[] = [];
  const setsPerExercise: Record<string, number> = { 
    beginner: 3, 
    intermediate: 4, 
    advanced: 4 
  };
  
  // For each muscle group, select appropriate exercises
  muscleGroups.forEach(muscleGroup => {
    const muscleExercises = exercises.filter(ex => 
      ex.muscleGroup === muscleGroup && 
      ex.equipment.some(eq => equipment.includes(eq))
    );
    
    if (muscleExercises.length === 0) return;
    
    // If beginner with minimum volume, use recommended exercises
    if (experience === 'beginner' && volumeLevel === 'minimum') {
      const recommended = getRecommendedExercises(muscleGroup, volumeLevel);
      if (recommended.length > 0) {
        const recommendedExercises = muscleExercises.filter(ex => 
          recommended.includes(ex.id)
        );
        if (recommendedExercises.length > 0) {
          selectedExercisesResult.push(...recommendedExercises);
          return;
        }
      }
    }
    
    // If user has selected exercises for this muscle group, prioritize those
    const userSelectedForMuscle = muscleExercises.filter(e => 
      selectedExercises.includes(e.id)
    );
    
    if (userSelectedForMuscle.length > 0) {
      selectedExercisesResult.push(...userSelectedForMuscle);
    } else {
      // Filter exercises based on recommendations
      const availableExercises = muscleExercises.filter(ex =>
        shouldRecommendExercise(ex, priorityMuscles, selectedExercisesResult)
      );
      
      // Select exercises randomly from the available pool
      const selected = [...availableExercises]
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
        
      selectedExercisesResult.push(...selected);
    }
  });
  
  return { exercises: selectedExercisesResult, setsPerExercise };
};
