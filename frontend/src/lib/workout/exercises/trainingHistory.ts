import { getSubGroupId } from './exerciseUtils';
import { undertrainedSubGroups } from './undertrainedGroups';

// Track user's training history by sub-group
export const trackSubgroupTrainingHistory = (
  completedWorkouts: any[],
  exercises: any[],
  currentSubgroupHistory: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }> = {}
): Record<string, { weeksUnderMEV: number, lastWeekTrained: number }> => {
  // Group workouts by week
  const workoutsByWeek: Record<number, any[]> = {};
  completedWorkouts.forEach(workout => {
    const weekNumber = workout.weekNumber || 1;
    if (!workoutsByWeek[weekNumber]) {
      workoutsByWeek[weekNumber] = [];
    }
    workoutsByWeek[weekNumber].push(workout);
  });
  
  // Get the latest week number
  const latestWeek = Math.max(...Object.keys(workoutsByWeek).map(Number), 0);
  
  // Initialize subgroup history if not provided
  const subgroupHistory = { ...currentSubgroupHistory };
  Object.keys(undertrainedSubGroups).forEach(subgroupId => {
    if (!subgroupHistory[subgroupId]) {
      subgroupHistory[subgroupId] = {
        weeksUnderMEV: 0,
        lastWeekTrained: 0
      };
    }
  });
  
  // Calculate volume for each subgroup in the latest week
  const subgroupSetsInLatestWeek: Record<string, number> = {};
  Object.keys(undertrainedSubGroups).forEach(subgroupId => {
    subgroupSetsInLatestWeek[subgroupId] = 0;
  });
  
  if (workoutsByWeek[latestWeek]) {
    workoutsByWeek[latestWeek].forEach(workout => {
      workout.exercises.forEach((workoutExercise: any) => {
        const exercise = exercises.find(e => e.id === workoutExercise.exerciseId);
        if (exercise) {
          const subgroupId = getSubGroupId(exercise);
          if (subgroupId && subgroupSetsInLatestWeek[subgroupId] !== undefined) {
            // Count working sets
            const workingSets = workoutExercise.sets.filter((set: any) => !set.isWarmUp).length;
            subgroupSetsInLatestWeek[subgroupId] += workingSets;
          }
        }
      });
    });
  }
  
  // Update weeks under MEV for each subgroup
  Object.keys(undertrainedSubGroups).forEach(subgroupId => {
    const currentWeekSets = subgroupSetsInLatestWeek[subgroupId] || 0;
    const mevThreshold = 4; // Minimum effective volume for a subgroup
    
    if (currentWeekSets < mevThreshold) {
      subgroupHistory[subgroupId].weeksUnderMEV += 1;
    } else {
      subgroupHistory[subgroupId].weeksUnderMEV = 0;
      subgroupHistory[subgroupId].lastWeekTrained = latestWeek;
    }
  });
  
  return subgroupHistory;
};

// Get priority subgroups that need additional volume
export const getPrioritySubgroups = (
  subgroupHistory: Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>,
  weeksBelowMEVThreshold: number = 3
): string[] => {
  return Object.entries(subgroupHistory)
    .filter(([_, data]) => data.weeksUnderMEV >= weeksBelowMEVThreshold)
    .sort(([idA, _], [idB, __]) => {
      // Sort by priority from the undertrainedSubGroups table
      const priorityA = undertrainedSubGroups[idA]?.priority || 0;
      const priorityB = undertrainedSubGroups[idB]?.priority || 0;
      return priorityB - priorityA; // Higher priority first
    })
    .map(([id, _]) => id);
};

// Generate recommendations based on undertrained subgroups
export const getSubgroupRecommendations = (
  prioritySubgroups: string[],
  volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'minimum'
): Record<string, number> => {
  // Only apply special allocations for minimum volume level (MEV)
  if (volumeLevel !== 'minimum') {
    return {};
  }
  
  const recommendations: Record<string, number> = {};
  
  // Allocate additional sets based on priority
  prioritySubgroups.forEach(subgroupId => {
    const subgroupData = undertrainedSubGroups[subgroupId];
    if (subgroupData) {
      const additionalSets = Math.floor(subgroupData.priority / 3); // Convert priority to additional sets
      recommendations[subgroupId] = additionalSets;
    }
  });
  
  return recommendations;
};
