
// Make addWorkingSet append new incomplete set (not completed, not warmup, copies last set's reps/weight).
// Allow updateExerciseSet to update weight and reps as numbers; skip logic is now handled in Workout page.

import { v4 as uuidv4 } from 'uuid';
import type { Set, Workout } from '@/types/workout';

export const useExerciseUpdates = (
  currentWorkout: Workout | null,
  setCurrentWorkout: (workout: Workout | null) => void,
) => {
  const updateExerciseSet = (exerciseIndex: number, setIndex: number, data: Partial<Set>) => {
    if (!currentWorkout) return;

    // Deep copy workout to avoid mutation
    const updatedWorkout: Workout = JSON.parse(JSON.stringify(currentWorkout));

    // Parse numbers for weight and reps
    if (updatedWorkout.exercises[exerciseIndex]) {
      const sets = updatedWorkout.exercises[exerciseIndex].sets;
      if (sets && sets[setIndex]) {
        let newSetObj = { ...sets[setIndex], ...data };
        if (typeof newSetObj.weight === "string") newSetObj.weight = parseFloat(newSetObj.weight) || 0;
        if (typeof newSetObj.reps === "string") newSetObj.reps = parseInt(newSetObj.reps) || 0;
        sets[setIndex] = newSetObj;
      }
    }
    setCurrentWorkout(updatedWorkout);
  };

  const addWorkingSet = (exerciseIndex: number) => {
    if (!currentWorkout) return;

    // Deep copy workout to avoid mutation
    const updatedWorkout: Workout = JSON.parse(JSON.stringify(currentWorkout));
    const exercise = updatedWorkout.exercises[exerciseIndex];
    if (!exercise) return;
    
    // Get last working set as template, or default values
    const lastWorkingSet = exercise.sets.slice(-1)[0];
    const newSet: Set = {
      id: uuidv4(),
      weight: lastWorkingSet?.weight ?? 0,
      reps: lastWorkingSet?.reps ?? 0,
      completed: false,
      isWarmUp: false,
    };
    exercise.sets.push(newSet);
    setCurrentWorkout(updatedWorkout);
  };

  return { updateExerciseSet, addWorkingSet };
};
