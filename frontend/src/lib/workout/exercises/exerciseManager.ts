
import type { Exercise } from '@/types/workout';
import chest from '@/data/exercises/chest.json';
import back from '@/data/exercises/back.json';
import shoulders from '@/data/exercises/shoulders.json';
import biceps from '@/data/exercises/biceps.json';
import triceps from '@/data/exercises/triceps.json';
import quads from '@/data/exercises/quads.json';
import hamstrings from '@/data/exercises/hamstrings.json';
import glutes from '@/data/exercises/glutes.json';
import calves from '@/data/exercises/calves.json';
import core from '@/data/exercises/core.json';
import { processExerciseData } from './exerciseProcessor';
import { ExerciseIndexes } from './exerciseIndexes';

// Combine and process all exercises
const rawExercises = [
  ...chest, ...back, ...shoulders, ...biceps, ...triceps,
  ...quads, ...hamstrings, ...glutes, ...calves, ...core
];

const processedExercises = processExerciseData(rawExercises);
const exerciseIndexes = new ExerciseIndexes(processedExercises);

// Export the processed exercise library
export const exerciseLibrary = processedExercises;

// Export lookup functions
export const getExerciseById = (id: string): Exercise | undefined => {
  return exerciseIndexes.getById(id);
};

export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return exerciseIndexes.getByMuscleGroup(muscleGroup);
};

export const getRecommendedExercises = (muscleGroup?: string): Exercise[] => {
  return exerciseIndexes.getRecommended(muscleGroup);
};
