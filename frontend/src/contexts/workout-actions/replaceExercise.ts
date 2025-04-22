
import type { Workout } from "@/types/workout";

export const replaceExercise = (
  currentWorkout: Workout | null,
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Workout[]>>,
  setCurrentWorkout: React.Dispatch<React.SetStateAction<Workout | null>>,
  toast: any
) => (
  exerciseIndex: number, newExerciseId: string, replaceForAll = false
) => {
  if (!currentWorkout) {
    console.warn("No current workout to replace exercise.");
    return;
  }
  if (replaceForAll) {
    const currentExerciseId = currentWorkout.exercises[exerciseIndex].exerciseId;
    setWorkoutPlan((prev: Workout[]) =>
      prev.map(workout => {
        const updatedExercises = workout.exercises?.map(exercise => {
          if (exercise.exerciseId === currentExerciseId) {
            return { ...exercise, exerciseId: newExerciseId };
          }
          return exercise;
        }) || [];
        return { ...workout, exercises: updatedExercises };
      })
    );
  }
  setCurrentWorkout((prev: Workout | null) => {
    if (!prev) return null;
    const updatedExercises = prev.exercises.map((exercise, idx) => {
      if (idx === exerciseIndex) return { ...exercise, exerciseId: newExerciseId };
      return exercise;
    });
    return { ...prev, exercises: updatedExercises };
  });
  if (toast) {
    toast({
      title: "Exercise replaced",
      description: replaceForAll ? "Exercise replaced in all workouts" : "Exercise replaced in current workout",
    });
  }
};
