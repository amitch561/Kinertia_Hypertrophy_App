import { useMemo } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Exercise } from '@/types/workout';
import { getSubGroupId } from '@/lib/workout/exercises/exerciseUtils';
import { 
  getExercisesByCategory, 
  getStretchFocusedExercises,
  ExerciseCategory 
} from '@/utils/exerciseCategories';

export const useExerciseLibrary = () => {
  const { exercises } = useWorkout();
  
  const categorizedExercises = useMemo(() => {
    return {
      push: getExercisesByCategory(exercises, 'push'),
      pull: getExercisesByCategory(exercises, 'pull'),
      legs: getExercisesByCategory(exercises, 'legs'),
      core: getExercisesByCategory(exercises, 'core'),
      recommended: getStretchFocusedExercises(exercises)
    };
  }, [exercises]);
  
  const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
    return exercises.filter(ex => ex.muscleGroup === muscleGroup);
  };
  
  const getExercisesBySubGroup = (muscleGroup: string, subGroupId: string): Exercise[] => {
    return exercises.filter(
      ex => ex.muscleGroup === muscleGroup && getSubGroupId(ex) === subGroupId
    );
  };
  
  const getRecommendedForMuscleGroup = (muscleGroup: string): Exercise[] => {
    return exercises.filter(
      ex => ex.muscleGroup === muscleGroup && ex.recommended === true
    );
  };
  
  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find(ex => ex.id === id);
  };
  
  return {
    categorizedExercises,
    getExercisesByMuscleGroup,
    getExercisesBySubGroup,
    getRecommendedForMuscleGroup,
    getExerciseById
  };
};

export default useExerciseLibrary;
