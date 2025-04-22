
import { v4 as uuidv4 } from 'uuid';
import type { Set } from '@/types/workout';

export const generateDefaultSets = (baseReps: number = 8): Set[] => {
  return [
    { id: uuidv4(), weight: 0, reps: 0, completed: false, isWarmUp: true },
    { id: uuidv4(), weight: 0, reps: baseReps, completed: false },
    { id: uuidv4(), weight: 0, reps: baseReps, completed: false }
  ];
};

