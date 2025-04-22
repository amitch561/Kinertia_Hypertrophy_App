
// Re-export everything from the new modular structure
export * from './workout/generator/workoutGenerator';

import type { Workout } from '@/types/workout';
import { v4 as uuidv4 } from 'uuid';
import { generateDefaultSets } from './workout/generator/utils/defaultSetGenerator';

export const generateWorkoutWithDefaults = (
  selectedExercises: string[] = [],
  phaseType?: string,
  focusMuscleGroups?: string[]
): Workout => {
  const workoutId = uuidv4();
  return {
    id: workoutId,
    name: `Workout ${workoutId.slice(0, 8)}`,
    day: 1,
    exercises: selectedExercises.map(exerciseId => ({
      exerciseId,
      sets: generateDefaultSets(),
      previousPerformance: []
    })),
    phaseType,
    focusMuscleGroups
  };
};

