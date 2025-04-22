
import type { Exercise, Workout } from '@/types/workout';

export interface SetOptions {
  repRangeMin?: number;
  repRangeMax?: number;
  restPeriod?: number;
  phaseType?: string;
}

export interface WorkoutGeneratorParams {
  experience: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  muscleGroups: string[];
  equipment: string[];
  priorityMuscles?: string[];
  selectedExercises?: string[];
  currentWeek?: number;
  phaseType?: string;
}
