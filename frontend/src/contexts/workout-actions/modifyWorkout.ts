
import { v4 as uuidv4 } from 'uuid';
import type { Workout, Set } from "@/types/workout";

export const modifyWorkout = (
  currentWorkout: Workout | null,
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Workout[]>>
) => ({
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => {
    if (!currentWorkout) return;
    setWorkoutPlan((prev: Workout[]) =>
      prev.map(workout => {
        if (workout.id === currentWorkout.id) {
          const updatedExercises = workout.exercises?.map((exercise, exIndex) => {
            if (exIndex === exerciseIndex) {
              const updatedSets = exercise.sets.map((set, sIndex) =>
                sIndex === setIndex ? { ...set, ...data } : set
              );
              return { ...exercise, sets: updatedSets };
            }
            return exercise;
          }) || [];
          return { ...workout, exercises: updatedExercises };
        }
        return workout;
      })
    );
  },
  addWorkingSet: (exerciseIndex: number) => {
    if (!currentWorkout) return;
    setWorkoutPlan((prev: Workout[]) =>
      prev.map(workout => {
        if (workout.id === currentWorkout.id) {
          const updatedExercises = workout.exercises?.map((exercise, exIndex) => {
            if (exIndex === exerciseIndex) {
              const newSet: Set = { id: uuidv4(), weight: 0, reps: 0, completed: false, isWarmUp: false };
              return { ...exercise, sets: [...exercise.sets, newSet] };
            }
            return exercise;
          }) || [];
          return { ...workout, exercises: updatedExercises };
        }
        return workout;
      })
    );
  }
});
