
// Calculation utilities for weekly and recommended volume

import type { Exercise, Workout } from "@/types/workout";
import { volumeRecommendations } from "./constants";

// Calculate total weekly volume per muscle group based on selected exercises
export const calculateWeeklyVolume = (
  workouts: Workout[], 
  exercises: Exercise[]
): Record<string, number> => {
  const weeklyVolume: Record<string, number> = {
    chest: 0,
    back: 0,
    shoulders: 0,
    biceps: 0,
    triceps: 0,
    legs: 0,
    quads: 0,
    hamstrings: 0,
    glutes: 0,
    calves: 0,
    core: 0
  };
  
  workouts.forEach(workout => {
    workout.exercises.forEach(workoutExercise => {
      const exercise = exercises.find(ex => ex.id === workoutExercise.exerciseId);
      if (exercise) {
        const muscleGroup = exercise.muscleGroup;
        const setsCount = workoutExercise.sets.length;
        if (weeklyVolume[muscleGroup] !== undefined) {
          weeklyVolume[muscleGroup] += setsCount;
        }
      }
    });
  });
  
  return weeklyVolume;
};

// Check if weekly volume is within recommended range
export const isVolumeWithinRecommendedRange = (
  muscleGroup: string,
  currentVolume: number
): { isWithinRange: boolean; isLow: boolean; isHigh: boolean } => {
  const minRecommended = volumeRecommendations.minimum[muscleGroup as keyof typeof volumeRecommendations.minimum] || 0;
  const maxRecommended = volumeRecommendations.maximum[muscleGroup as keyof typeof volumeRecommendations.maximum] || 0;
  
  const isLow = currentVolume < minRecommended;
  const isHigh = currentVolume > maxRecommended;
  const isWithinRange = !isLow && !isHigh;
  
  return {
    isWithinRange,
    isLow,
    isHigh
  };
};

// Get volume recommendation for a muscle group
export const getVolumeRecommendation = (
  muscleGroup: string
): { min: number; moderate: number; max: number } => {
  return {
    min: volumeRecommendations.minimum[muscleGroup as keyof typeof volumeRecommendations.minimum] || 0,
    moderate: volumeRecommendations.moderate[muscleGroup as keyof typeof volumeRecommendations.moderate] || 0,
    max: volumeRecommendations.maximum[muscleGroup as keyof typeof volumeRecommendations.maximum] || 0
  };
};
