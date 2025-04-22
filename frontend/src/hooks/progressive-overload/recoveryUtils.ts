
import type { RecoveryFeedback } from './types';

export const calculateRecoveryScore = (feedback: RecoveryFeedback): number => {
  if (!feedback) return 3; // Default middle value
  
  // Formula: (pump + (6-soreness) + (6-fatigue)) / 3
  const pumpScore = feedback.pump;
  const sorenessScore = 6 - feedback.soreness;
  const fatigueScore = 6 - feedback.fatigue;
  
  return (pumpScore + sorenessScore + fatigueScore) / 3;
};
