
import type { Exercise } from '@/types/workout';

export interface WorkoutPlanOptions {
  experience?: string;
  availableDays: number | string[];
  equipment?: string[];
  priorityMuscles?: string[];
  volumeLevel?: 'minimum' | 'moderate' | 'maximum';
  selectedExercises?: string[];
  trainingGoal?: string;
  currentWeek?: number;
  phaseType?: string;
  userFeedback?: { muscleGroup: string; recoveryScore: number }[];
  subgroupHistory?: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>;
}

export interface ExerciseVolumeRecommendation {
  beginner: { minimum: number; moderate: number; maximum: number };
  intermediate: { minimum: number; moderate: number; maximum: number };
  advanced: { minimum: number; moderate: number; maximum: number };
}

export interface VolumeRangeByMuscle {
  [muscleGroup: string]: ExerciseVolumeRecommendation;
}

export interface MuscleGroupVolumeStatus {
  muscleGroup: string;
  current: number;
  min: number;
  moderate: number;
  max: number;
  isLow: boolean;
  isHigh: boolean;
  isExceedingMEV?: boolean;
  subgroupStatuses?: SubgroupVolumeStatus[];
}

export interface SubgroupVolumeStatus {
  subgroupId: string;
  name: string;
  current: number;
  required: number;
  isUndertrained: boolean;
  priority: number;
  weeksUnderMEV?: number;
}
