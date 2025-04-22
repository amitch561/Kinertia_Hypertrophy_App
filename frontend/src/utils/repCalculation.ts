
export const calculateTargetReps = (maxReps: number = 12): number => {
  // Default to 12 reps max if no previous performance data
  const estimatedFailurePoint = maxReps;
  const RFF = 3; // Reps From Failure
  
  // Ensure we don't go below 1 rep
  return Math.max(estimatedFailurePoint - RFF, 1);
};
