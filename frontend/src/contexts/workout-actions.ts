
// Re-export from newly split actions for compatibility
import { calculateCurrentVolumeStatus } from "./workout-actions/volumeStatus";
import { crudActions } from "./workout-actions/crudActions";
import { completeWorkout } from "./workout-actions/completeWorkout";
import { modifyWorkout } from "./workout-actions/modifyWorkout";
import { replaceExercise } from "./workout-actions/replaceExercise";
import { generateNewWorkoutPlan } from "./workout-actions/generatePlan";

// Create a combined object for backward compatibility
export const workoutActions = {
  calculateCurrentVolumeStatus,
  create: (params: any) => ({
    ...crudActions(params),
    ...modifyWorkout(params.currentWorkout, params.setWorkoutPlan),
    replaceExercise: replaceExercise(
      params.currentWorkout, 
      params.setWorkoutPlan, 
      params.setCurrentWorkout, 
      params.toast
    ),
    completeWorkout: (feedback?: 'too_easy' | 'just_right' | 'too_hard') => 
      completeWorkout(
        params.currentWorkout,
        params.completedWorkouts,
        params.setCompletedWorkouts,
        params.setCurrentWorkout,
        params.toast,
        feedback || 'just_right'
      )
  })
};

// Continue exporting individual functions for direct use
export * from "./workout-actions/volumeStatus";
export * from "./workout-actions/crudActions";
export * from "./workout-actions/completeWorkout";
export * from "./workout-actions/modifyWorkout";
export * from "./workout-actions/replaceExercise";
export * from "./workout-actions/generatePlan";
