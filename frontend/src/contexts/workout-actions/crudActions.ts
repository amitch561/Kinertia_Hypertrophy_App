
import { v4 as uuidv4 } from 'uuid';
import type { Exercise, Workout, Set, CompletedWorkout } from "@/types/workout";

interface CRUDParams {
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Workout[]>>;
  setCompletedWorkouts: React.Dispatch<React.SetStateAction<CompletedWorkout[]>>;
  setCurrentWorkout: React.Dispatch<React.SetStateAction<Workout | null>>;
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  toast: any;
  exercises: Exercise[];
  workoutPlan: Workout[];
  completedWorkouts: CompletedWorkout[];
  currentWorkout: Workout | null;
}

export const crudActions = ({
  setWorkoutPlan,
  setCompletedWorkouts,
  setCurrentWorkout,
  setExercises,
  toast,
  exercises,
  workoutPlan,
  completedWorkouts,
  currentWorkout,
}: Partial<CRUDParams>) => ({
  addWorkout: (workout: Workout) => {
    setWorkoutPlan && setWorkoutPlan((prev: Workout[]) => [...prev, workout]);
  },
  updateWorkout: (workoutId: string, updates: Partial<Workout>) => {
    setWorkoutPlan && setWorkoutPlan((prev: Workout[]) => prev.map(
      w => w.id === workoutId ? { ...w, ...updates } : w
    ));
  },
  deleteWorkout: (workoutId: string) => {
    setWorkoutPlan && setWorkoutPlan((prev: Workout[]) => prev.filter(w => w.id !== workoutId));
  },
  addExerciseToWorkout: (workoutId: string, exerciseId: string) => {
    setWorkoutPlan && setWorkoutPlan((prev: Workout[]) => prev.map(workout => {
      if (workout.id === workoutId) {
        const newExercise = {
          exerciseId,
          sets: [{ id: uuidv4(), weight: 0, reps: 0, completed: false, isWarmUp: true }],
          previousPerformance: [],
        };
        return {
          ...workout,
          exercises: [...(workout.exercises || []), newExercise],
        };
      }
      return workout;
    }));
  },
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => {
    setWorkoutPlan && setWorkoutPlan((prev: Workout[]) => prev.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises?.filter(ex => ex.exerciseId !== exerciseId),
        };
      }
      return workout;
    }));
  },
});
