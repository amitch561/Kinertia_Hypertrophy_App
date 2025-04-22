
import { volumeLandmarks } from './volumeLandmarks';
import type { WorkoutPlanOptions } from './types';

export const calculateTargetSets = (
  muscleGroup: keyof typeof volumeLandmarks,
  options: WorkoutPlanOptions,
  isPriority: boolean
): number => {
  const { experience = 'beginner', currentWeek = 1, userFeedback = [], phaseType, volumeLevel = 'moderate' } = options;
  const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
  const landmark = volumeLandmarks[muscleGroup][expLevel];
  
  let targetSets = 0;
  const isDeloadWeek = currentWeek % 5 === 0;
  
  if (isDeloadWeek) {
    targetSets = Math.floor(landmark.minimum / 2);
  } else {
    if (currentWeek === 1) {
      targetSets = landmark.minimum;
    } else if (currentWeek === 2) {
      targetSets = Math.floor(landmark.minimum * 1.2);
    } else if (currentWeek === 3) {
      targetSets = landmark.moderate;
    } else if (currentWeek === 4) {
      targetSets = Math.floor(landmark.moderate * 1.1);
    }
    
    const feedbackForMuscle = userFeedback.find(f => f.muscleGroup === muscleGroup);
    if (feedbackForMuscle) {
      if (feedbackForMuscle.recoveryScore >= 4) {
        targetSets = Math.min(targetSets + 1, landmark.maximum);
      } else if (feedbackForMuscle.recoveryScore <= 2) {
        targetSets = Math.max(targetSets - 1, landmark.minimum);
      }
    }
    
    if (isPriority) {
      const priorityBonus = expLevel === 'beginner' ? 2 : 
                            expLevel === 'intermediate' ? 3 : 4;
      targetSets += priorityBonus;
    }
  }
  
  return targetSets;
};
