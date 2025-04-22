
import type { Exercise, SubGroupMetadata } from '@/types/workout';
import { subGroupMetadata } from './metadata';
import { determineSubGroup } from './subgroupMapping';

// Process and enhance raw exercise data with metadata
export const processExerciseData = (rawExercises: any[]): Exercise[] => {
  return rawExercises.map(exercise => {
    const subGroupId = determineSubGroup(exercise.name, exercise.muscleGroup);
    const subGroup = subGroupMetadata[subGroupId] || {
      name: subGroupId,
      primaryGroup: exercise.muscleGroup,
      secondaryWith: []
    };

    return {
      ...exercise,
      subGroup,
      exerciseType: exercise.exerciseType as 'compound' | 'isolation'
    };
  });
};

// Group exercises by various criteria
export const groupExercisesByMuscle = (exercises: Exercise[]): Map<string, Exercise[]> => {
  const grouped = new Map<string, Exercise[]>();
  
  exercises.forEach(exercise => {
    if (!grouped.has(exercise.muscleGroup)) {
      grouped.set(exercise.muscleGroup, []);
    }
    grouped.get(exercise.muscleGroup)?.push(exercise);
  });
  
  return grouped;
};
