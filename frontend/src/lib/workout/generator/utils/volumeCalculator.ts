
import { volumeLandmarks } from '../volumeLandmarks';
import type { WorkoutPlanOptions } from '../types';
import { undertrainedSubGroups, getSubgroupRecommendations } from '../../exercises/secondaryMuscleMap';

export const calculateTargetSets = (
  muscleGroup: keyof typeof volumeLandmarks,
  options: WorkoutPlanOptions,
  isPriority: boolean
): number => {
  const { 
    experience = 'beginner', 
    currentWeek = 1, 
    userFeedback = [], 
    phaseType, 
    volumeLevel = 'moderate',
    subgroupHistory = {} 
  } = options;
  
  const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
  const landmark = volumeLandmarks[muscleGroup][expLevel];
  
  let targetSets = 0;
  const isDeloadWeek = currentWeek % 5 === 0;
  
  // Calculate base target sets based on volumeLevel directly
  if (isDeloadWeek) {
    // For deload weeks, we use half of the minimum effective volume
    targetSets = Math.floor(landmark.minimum / 2);
  } else {
    // For regular weeks, use the appropriate volume level
    if (volumeLevel === 'minimum') {
      targetSets = landmark.minimum;
    } else if (volumeLevel === 'moderate') {
      targetSets = landmark.moderate;
    } else if (volumeLevel === 'maximum') {
      targetSets = landmark.maximum;
    } else {
      // Default to moderate if not specified
      targetSets = landmark.moderate;
    }
    
    // Progressive overload based on training week (only applies if volumeLevel is not explicitly set)
    // This ensures volumeLevel takes precedence over week-based progression
    if (!options.volumeLevel) {
      if (currentWeek === 2) {
        targetSets = Math.floor(targetSets * 1.1); // 10% increase in week 2
      } else if (currentWeek === 3) {
        targetSets = Math.floor(targetSets * 1.15); // 15% increase in week 3
      } else if (currentWeek === 4) {
        targetSets = Math.floor(targetSets * 1.2); // 20% increase in week 4
      }
    }
    
    // Adjust based on user feedback if available
    const feedbackForMuscle = userFeedback.find(f => f.muscleGroup === muscleGroup);
    if (feedbackForMuscle) {
      if (feedbackForMuscle.recoveryScore >= 4) {
        targetSets = Math.min(targetSets + 1, landmark.maximum);
      } else if (feedbackForMuscle.recoveryScore <= 2) {
        targetSets = Math.max(targetSets - 1, landmark.minimum);
      }
    }
    
    // Apply priority bonus if muscle group is prioritized
    if (isPriority) {
      const priorityBonus = expLevel === 'beginner' ? 2 : 
                            expLevel === 'intermediate' ? 3 : 4;
      targetSets += priorityBonus;
    }
    
    // Apply undertrained subgroup prioritization
    if (subgroupHistory) {
      // Get priority subgroups that need additional volume
      const prioritySubgroups = Object.keys(subgroupHistory)
        .filter(subgroupId => {
          const data = subgroupHistory[subgroupId];
          return data.weeksUnderMEV >= 3 && 
                 undertrainedSubGroups[subgroupId]?.muscleGroup === muscleGroup;
        });
      
      if (prioritySubgroups.length > 0) {
        // Allocate additional sets based on the highest priority subgroup
        const highestPrioritySubgroup = prioritySubgroups.reduce((highest, current) => {
          const highestPriority = undertrainedSubGroups[highest]?.priority || 0;
          const currentPriority = undertrainedSubGroups[current]?.priority || 0;
          return currentPriority > highestPriority ? current : highest;
        }, prioritySubgroups[0]);
        
        const additionalSets = Math.ceil(undertrainedSubGroups[highestPrioritySubgroup]?.priority / 4) || 0;
        targetSets += additionalSets;
      }
    }
  }
  
  // Add debug logging to help diagnose volume issues
  console.log(`Target sets for ${muscleGroup}: ${targetSets} (volumeLevel: ${volumeLevel})`);
  
  return targetSets;
};
