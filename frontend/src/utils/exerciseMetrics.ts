
import type { Exercise } from "@/types/workout";

interface ExerciseMetrics {
  stretchLoad: number;  // 0-10 scale of stretch under load
  rom: number;         // 0-10 scale of range of motion
}

// Empirical ratings for stretch-loading potential (based on exercise mechanics)
const stretchMetrics: Record<string, ExerciseMetrics> = {
  // Chest
  'incline_dumbbell_press': { stretchLoad: 9, rom: 9 },
  'flat_dumbbell_press': { stretchLoad: 8, rom: 8 },
  // Back
  'lat_pulldown': { stretchLoad: 9, rom: 9 },
  'pull_ups': { stretchLoad: 8, rom: 9 },
  // Shoulders
  'overhead_press': { stretchLoad: 7, rom: 8 },
  'lateral_raise': { stretchLoad: 6, rom: 7 },
  // Biceps
  'incline_dumbbell_curl': { stretchLoad: 10, rom: 10 },
  'preacher_curl': { stretchLoad: 9, rom: 9 },
  // Triceps
  'overhead_extension': { stretchLoad: 9, rom: 9 },
  'skull_crusher': { stretchLoad: 8, rom: 9 },
  // Quads
  'sissy_squat': { stretchLoad: 10, rom: 10 },
  'hack_squat': { stretchLoad: 9, rom: 9 },
  // Hamstrings
  'romanian_deadlift': { stretchLoad: 10, rom: 9 },
  'good_morning': { stretchLoad: 9, rom: 9 },
  // Glutes
  'hip_thrust': { stretchLoad: 8, rom: 8 },
  'bulgarian_split_squat': { stretchLoad: 9, rom: 9 },
  // Calves
  'standing_calf_raise': { stretchLoad: 9, rom: 9 },
  'seated_calf_raise': { stretchLoad: 8, rom: 8 },
};

export const getStretchScore = (exerciseId: string): number => {
  const metrics = stretchMetrics[exerciseId];
  if (!metrics) return 0;
  return (metrics.stretchLoad + metrics.rom) / 2;
};

export const getTopStretchExercises = (exercises: Exercise[]): string[] => {
  return [...exercises]
    .sort((a, b) => getStretchScore(b.id) - getStretchScore(a.id))
    .slice(0, 2)
    .map(ex => ex.id);
};

export const isStretchFocused = (exerciseId: string): boolean => {
  const score = getStretchScore(exerciseId);
  return score >= 8; // Threshold for "stretch-focused" classification
};
