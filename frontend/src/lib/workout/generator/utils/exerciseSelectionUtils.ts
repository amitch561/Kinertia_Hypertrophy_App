
import type { Exercise } from '@/types/workout';
import { volumeLandmarks } from '../volumeLandmarks';
import { undertrainedSubGroups, getPrioritySubgroups } from '../../exercises/secondaryMuscleMap';
import { getSubGroupId } from '../../exercises/exerciseUtils';

// Get recommended exercises for a given muscle group
export const getRecommendedExercisesForMuscle = (
  allExercises: Exercise[],
  muscleGroup: string,
  experienceLevel: string,
  subgroupHistory?: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>
): Exercise[] => {
  // Filter exercises for the target muscle group
  const muscleExercises = allExercises.filter(ex => ex.muscleGroup === muscleGroup);
  
  // If we have subgroup history, prioritize undertrained subgroups
  if (subgroupHistory) {
    const prioritySubgroups = getPrioritySubgroups(subgroupHistory);
    
    if (prioritySubgroups.length > 0) {
      // Filter exercises that target the priority subgroups
      const priorityExercises = muscleExercises.filter(ex => {
        const subgroupId = getSubGroupId(ex);
        return prioritySubgroups.includes(subgroupId);
      });
      
      // If we have exercises for priority subgroups, return them first
      if (priorityExercises.length > 0) {
        return priorityExercises;
      }
    }
  }
  
  // For beginners, prioritize compound exercises
  if (experienceLevel === 'beginner') {
    const compoundExercises = muscleExercises.filter(ex => ex.exerciseType === 'compound');
    
    // If we have compound exercises, prioritize them
    if (compoundExercises.length > 0) {
      // Return a mix of compounds (prioritized) and some isolations
      return [...compoundExercises, ...muscleExercises.filter(ex => ex.exerciseType !== 'compound').slice(0, 2)];
    }
  }
  
  return muscleExercises;
};

// Select exercises for a workout based on muscle group, experience, and volume
export const selectExercisesForWorkout = (
  allExercises: Exercise[],
  muscleGroup: string,
  experienceLevel: string,
  volumeLevel: 'minimum' | 'moderate' | 'maximum',
  equipment: string[] = [],
  selectedExercises: string[] = [],
  subgroupHistory?: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>
): Exercise[] => {
  // Get recommended exercises for the muscle group
  let muscleExercises = getRecommendedExercisesForMuscle(
    allExercises, 
    muscleGroup,
    experienceLevel,
    subgroupHistory
  );
  
  // Filter by available equipment if specified
  if (equipment.length > 0) {
    muscleExercises = muscleExercises.filter(ex => 
      ex.equipment.some(eq => equipment.includes(eq))
    );
  }
  
  // If user has selected specific exercises, prioritize those
  const userSelectedForMuscle = muscleExercises.filter(ex => 
    selectedExercises.includes(ex.id)
  );
  
  if (userSelectedForMuscle.length > 0) {
    return userSelectedForMuscle;
  }
  
  // Determine how many exercises to include based on volume target
  const targetSets = volumeLandmarks[muscleGroup as keyof typeof volumeLandmarks]?.[experienceLevel as 'beginner' | 'intermediate' | 'advanced']?.[volumeLevel] || 10;
  
  // For beginners with minimal volume, use fewer exercises
  let targetExerciseCount: number;
  
  if (experienceLevel === 'beginner' && volumeLevel === 'minimum') {
    targetExerciseCount = 1; // Just one main exercise for beginners at minimum volume
  } else if (experienceLevel === 'beginner') {
    targetExerciseCount = 2; // Two exercises for beginners at moderate/maximum
  } else if (experienceLevel === 'intermediate' && volumeLevel === 'minimum') {
    targetExerciseCount = 2; // Two exercises for intermediates at minimum
  } else if (volumeLevel === 'maximum') {
    targetExerciseCount = 3; // Three exercises for maximum volume regardless of level
  } else {
    targetExerciseCount = 2; // Default to two exercises
  }
  
  // If we have priority subgroups, adjust target exercise count to ensure coverage
  if (subgroupHistory) {
    const prioritySubgroups = getPrioritySubgroups(subgroupHistory);
    const prioritySubgroupsForMuscle = prioritySubgroups.filter(
      subgroupId => undertrainedSubGroups[subgroupId]?.muscleGroup === muscleGroup
    );
    
    if (prioritySubgroupsForMuscle.length > 0) {
      // Ensure at least one exercise per priority subgroup
      targetExerciseCount = Math.max(targetExerciseCount, prioritySubgroupsForMuscle.length);
    }
  }
  
  // Group exercises by subgroup
  const exercisesBySubgroup: Record<string, Exercise[]> = {};
  
  muscleExercises.forEach(exercise => {
    const subgroupId = getSubGroupId(exercise);
    if (!exercisesBySubgroup[subgroupId]) {
      exercisesBySubgroup[subgroupId] = [];
    }
    exercisesBySubgroup[subgroupId].push(exercise);
  });
  
  let selectedForWorkout: Exercise[] = [];
  
  // If we have subgroup history, first select exercises for priority subgroups
  if (subgroupHistory) {
    const prioritySubgroups = getPrioritySubgroups(subgroupHistory);
    
    // First, add one exercise for each priority subgroup for this muscle
    prioritySubgroups
      .filter(subgroupId => undertrainedSubGroups[subgroupId]?.muscleGroup === muscleGroup)
      .forEach(subgroupId => {
        if (exercisesBySubgroup[subgroupId] && exercisesBySubgroup[subgroupId].length > 0) {
          // Randomize the selection within the subgroup
          const randomIndex = Math.floor(Math.random() * exercisesBySubgroup[subgroupId].length);
          selectedForWorkout.push(exercisesBySubgroup[subgroupId][randomIndex]);
        }
      });
  }
  
  // If we still need more exercises to reach the target count, add compounds first, then isolations
  if (selectedForWorkout.length < targetExerciseCount) {
    const remainingExercises = muscleExercises.filter(ex => 
      !selectedForWorkout.some(selected => selected.id === ex.id)
    );
    
    const compounds = remainingExercises.filter(ex => ex.exerciseType === 'compound');
    const isolations = remainingExercises.filter(ex => ex.exerciseType !== 'compound');
    
    // Add compound exercises first
    const compoundsToAdd = Math.min(compounds.length, targetExerciseCount - selectedForWorkout.length);
    if (compoundsToAdd > 0) {
      selectedForWorkout = [
        ...selectedForWorkout,
        ...compounds
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, compoundsToAdd)
      ];
    }
    
    // If we still need more, add isolations
    if (selectedForWorkout.length < targetExerciseCount && isolations.length > 0) {
      selectedForWorkout = [
        ...selectedForWorkout,
        ...isolations
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, targetExerciseCount - selectedForWorkout.length)
      ];
    }
  }
  
  // If we still don't have enough exercises, just use whatever is available
  if (selectedForWorkout.length === 0 && muscleExercises.length > 0) {
    selectedForWorkout = muscleExercises
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, targetExerciseCount);
  }
  
  return selectedForWorkout;
};
