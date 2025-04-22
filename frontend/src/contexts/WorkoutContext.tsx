
// Just the context, hook, and re-exports for simplicity.

import React, { createContext, useContext } from "react";
import type { Exercise, Workout, CompletedWorkout, Set } from "@/types/workout";

interface WorkoutContextProps {
  exercises: Exercise[];
  workoutPlan: Workout[];
  completedWorkouts: CompletedWorkout[];
  currentWorkout: Workout | null;
  volumeStatus: { muscleGroup: string; current: number; min: number; moderate: number; max: number; isLow: boolean; isHigh: boolean }[];
  macroCyclePlan: any;
  currentPhase: any;
  subgroupHistory: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>;
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Workout[]>>;
  setCompletedWorkouts: React.Dispatch<React.SetStateAction<CompletedWorkout[]>>;
  setCurrentWorkout: React.Dispatch<React.SetStateAction<Workout | null>>;
  setMacroCyclePlan: (plan: any) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workoutId: string, updates: Partial<Workout>) => void;
  deleteWorkout: (workoutId: string) => void;
  completeWorkout: (feedback: 'too_easy' | 'just_right' | 'too_hard') => boolean;
  addExerciseToWorkout: (workoutId: string, exerciseId: string) => void;
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => void;
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  addWorkingSet: (exerciseIndex: number) => void;
  calculateCurrentVolumeStatus: (selectedExercises?: string[], focusMuscleGroups?: string[], experience?: string, volumeLevel?: "minimum" | "moderate" | "maximum") => { muscleGroup: string; current: number; min: number; moderate: number; max: number; isLow: boolean; isHigh: boolean }[];
  replaceExercise: (exerciseIndex: number, newExerciseId: string, replaceForAll?: boolean) => void;
  generateNewWorkoutPlan: (volumeLevel?: 'minimum' | 'moderate' | 'maximum', selectedExercises?: string[], phaseType?: string, focusMuscleGroups?: string[]) => Workout;
}

export const WorkoutContext = createContext<WorkoutContextProps | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};

// Don't import WorkoutProvider here to avoid circular dependency
