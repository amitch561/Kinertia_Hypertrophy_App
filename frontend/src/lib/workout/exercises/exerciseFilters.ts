import type { Exercise } from '@/types/workout';
import { getSubGroupId } from './exerciseUtils';
import { 
  secondaryMuscleMap, 
  undertrainedSubGroups, 
  getPrioritySubgroups 
} from './secondaryMuscleMap';

export const shouldRecommendExercise = (
  exercise: Exercise,
  focusMuscleGroups: string[],
  selectedExercises: Exercise[],
  subgroupHistory?: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>,
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate'
): boolean => {
  // Always recommend exercises for focus muscle groups
  if (focusMuscleGroups.includes(exercise.muscleGroup)) {
    return true;
  }

  // Only apply secondary muscle logic to front deltoids
  if (exercise.muscleGroup === 'shoulders' && getSubGroupId(exercise) === 'front') {
    const hasChestExercises = selectedExercises.some(ex => ex.muscleGroup === 'chest');
    if (hasChestExercises && !focusMuscleGroups.includes('shoulders')) {
      return false;
    }
  }
  
  // For minimum volume phases, prioritize undertrained subgroups
  if (volumeLevel === 'minimum' && subgroupHistory && exercise.subGroup) {
    const subGroupId = getSubGroupId(exercise);
    const prioritySubgroups = getPrioritySubgroups(subgroupHistory);
    
    // Highly recommend exercises for undertrained subgroups
    if (prioritySubgroups.includes(subGroupId)) {
      return true;
    }
    
    // If we're in a minimum volume phase and the subgroup is not prioritized,
    // check if it has a low priority in the undertrained table
    const subgroupData = undertrainedSubGroups[subGroupId];
    if (subgroupData && subgroupData.priority < 5) {
      // Lower priority subgroups get lower recommendation in minimum volume phases
      return false;
    }
  }

  return true;
};
