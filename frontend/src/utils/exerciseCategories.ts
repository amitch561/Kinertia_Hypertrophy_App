
import type { Exercise } from "@/types/workout";

export type ExerciseCategory = 'push' | 'pull' | 'legs' | 'core';

// Map muscle groups to their primary movement category
export const muscleGroupToCategory: Record<string, ExerciseCategory> = {
  'chest': 'push',
  'shoulders': 'push',
  'triceps': 'push',
  'back': 'pull',
  'biceps': 'pull',
  'traps': 'pull',
  'quads': 'legs',
  'hamstrings': 'legs',
  'glutes': 'legs',
  'calves': 'legs',
  'core': 'core'
};

// Function to get category for an exercise
export const getExerciseCategory = (exercise: Exercise): ExerciseCategory => {
  return muscleGroupToCategory[exercise.muscleGroup] || 'core';
};

// Get exercises for a specific category
export const getExercisesByCategory = (
  exercises: Exercise[], 
  category: ExerciseCategory
): Exercise[] => {
  return exercises.filter(ex => getExerciseCategory(ex) === category);
};

// Get all stretch-focused exercises
export const getStretchFocusedExercises = (exercises: Exercise[]): Exercise[] => {
  return exercises.filter(ex => ex.recommended === true);
};

// Get stretch-focused exercises by category
export const getStretchFocusedByCategory = (
  exercises: Exercise[], 
  category: ExerciseCategory
): Exercise[] => {
  return getExercisesByCategory(exercises, category).filter(ex => ex.recommended === true);
};

// Filter exercises with specific equipment
export const filterByEquipment = (
  exercises: Exercise[], 
  equipment: string[]
): Exercise[] => {
  if (!equipment || equipment.length === 0) return exercises;
  
  return exercises.filter(ex => 
    ex.equipment.some(eq => equipment.includes(eq))
  );
};
