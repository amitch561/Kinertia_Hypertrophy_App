
import { v4 as uuidv4 } from 'uuid';
import { generateWorkoutPlan } from '@/lib/workoutGeneratorExtended';
import type { Workout } from '@/types/workout';
import { useAuth } from '@/contexts/AuthContext';

export const generateNewWorkoutPlan = (
  selectedExercises: string[] = [],
  phaseType?: string,
  focusMuscleGroups?: string[],
  subgroupHistory?: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>
): Workout => {
  const user = { experience: 'beginner', availableDays: ['mon', 'wed', 'fri'], equipment: ['barbell', 'dumbbell'] };
  
  // Define a proper volumeLevel based on phaseType
  let volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate';
  if (phaseType === 'recovery') {
    volumeLevel = 'minimum';
  } else if (phaseType === 'strength') {
    volumeLevel = 'maximum';
  }
  
  const options = {
    experience: user.experience || 'beginner',
    availableDays: user.availableDays || ['mon', 'wed', 'fri'],
    equipment: user.equipment || ['barbell', 'dumbbell'],
    trainingGoal: 'hypertrophy',
    priorityMuscles: focusMuscleGroups || [],
    volumeLevel, // Now properly typed
    selectedExercises,
    currentWeek: 1,
    phaseType,
    subgroupHistory // Pass subgroup history to the generator
  };
  
  const workoutPlan = generateWorkoutPlan([], options);

  // Create a single workout from the plan
  const workout: Workout = {
    id: uuidv4(),
    name: "Custom Workout",
    day: 1,
    exercises: [],
    phaseType,
    focusMuscleGroups
  };

  return workout;
};
