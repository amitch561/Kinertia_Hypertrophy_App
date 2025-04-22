
import { useWorkoutCompletion } from './useWorkoutCompletion';
import { useExerciseUpdates } from './useExerciseUpdates';
import { useExerciseReplacement } from './useExerciseReplacement';
import { useWorkoutPlanGeneration } from './useWorkoutPlanGeneration';
import type { Exercise, Workout, CompletedWorkout } from '@/types/workout';

export const useWorkoutActions = (
  exercises: Exercise[],
  workoutPlan: Workout[],
  completedWorkouts: CompletedWorkout[],
  currentWorkout: Workout | null,
  setWorkoutPlan: (plan: Workout[]) => void,
  setCompletedWorkouts: (workouts: CompletedWorkout[]) => void,
  setCurrentWorkout: (workout: Workout | null) => void,
  setMuscleGroupProgress: (progress: any[]) => void
) => {
  const { updateExerciseSet, addWorkingSet } = useExerciseUpdates(currentWorkout, setCurrentWorkout);
  
  const { replaceExercise } = useExerciseReplacement(
    exercises,
    workoutPlan,
    currentWorkout,
    setWorkoutPlan,
    setCurrentWorkout
  );
  
  const { completeWorkout } = useWorkoutCompletion(
    completedWorkouts,
    setCompletedWorkouts,
    setWorkoutPlan,
    setCurrentWorkout,
    setMuscleGroupProgress
  );
  
  const { generateNewWorkoutPlan } = useWorkoutPlanGeneration(exercises, setWorkoutPlan);

  return {
    updateExerciseSet,
    addWorkingSet,
    replaceExercise,
    completeWorkout: (feedback?: 'too_easy' | 'just_right' | 'too_hard'): boolean => 
      completeWorkout(currentWorkout, feedback),
    generateNewWorkoutPlan,
  };
};
