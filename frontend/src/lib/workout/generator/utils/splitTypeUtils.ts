
import type { Exercise, Workout } from '@/types/workout';

type SplitType = 'push_pull_legs' | 'upper_lower' | 'full_body' | 'custom';

export const determineSplitType = (daysPerWeek: number): SplitType => {
  if (daysPerWeek >= 5) {
    return 'push_pull_legs';
  } else if (daysPerWeek === 4) {
    return 'upper_lower';
  } else {
    return 'full_body';
  }
};

export const getMuscleGroupsForSplit = (splitType: SplitType, dayIndex: number): string[] => {
  switch (splitType) {
    case 'push_pull_legs':
      // Rotate through Push, Pull, Legs
      const pplDay = dayIndex % 3;
      if (pplDay === 0) return ['chest', 'shoulders', 'triceps']; // Push
      if (pplDay === 1) return ['back', 'biceps']; // Pull
      return ['quads', 'hamstrings', 'glutes', 'calves']; // Legs
      
    case 'upper_lower':
      // Alternate Upper, Lower
      return dayIndex % 2 === 0 
        ? ['chest', 'back', 'shoulders', 'biceps', 'triceps'] // Upper
        : ['quads', 'hamstrings', 'glutes', 'calves']; // Lower
        
    case 'full_body':
    default:
      // All muscle groups each day, with focus rotation
      return ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'];
  }
};

// Determine training frequency for a muscle group based on split type
export const getTrainingFrequencyForMuscle = (
  muscleGroup: string,
  daysPerWeek: number,
  splitType: SplitType
): number => {
  switch (splitType) {
    case 'push_pull_legs':
      // Each muscle trained once per PPL rotation
      if (['chest', 'shoulders', 'triceps'].includes(muscleGroup)) {
        // Push muscles
        return Math.min(Math.ceil(daysPerWeek / 3), 3); // Max 3x/week
      } else if (['back', 'biceps'].includes(muscleGroup)) {
        // Pull muscles
        return Math.min(Math.ceil(daysPerWeek / 3), 3); // Max 3x/week
      } else {
        // Leg muscles
        return Math.min(Math.ceil(daysPerWeek / 3), 3); // Max 3x/week
      }
      
    case 'upper_lower':
      if (['chest', 'back', 'shoulders', 'biceps', 'triceps'].includes(muscleGroup)) {
        // Upper body muscles
        return Math.ceil(daysPerWeek / 2);
      } else {
        // Lower body muscles
        return Math.floor(daysPerWeek / 2);
      }
      
    case 'full_body':
    default:
      // All muscles trained each workout day
      return daysPerWeek;
  }
};
