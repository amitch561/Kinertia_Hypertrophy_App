
import type { Exercise, Set } from "@/types/workout";
import { v4 as uuidv4 } from 'uuid';

interface SetTemplate {
  weight: number;
  reps: number;
  isWarmUp?: boolean;
}

// Generate sets for an exercise
const generateExerciseSets = (
  exercise: Exercise,
  totalSets: number,
  experience: string,
  restMinutes: number,
  includeWarmups: boolean = true
): Set[] => {
  // Set default values for different experience levels
  const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
  
  // Default rep ranges based on common recommendations
  const repRanges = {
    beginner: { min: 8, max: 12 },
    intermediate: { min: 6, max: 12 },
    advanced: { min: 6, max: 15 }
  };
  
  // Get rep range for the current experience level
  const { min, max } = repRanges[expLevel] || repRanges.beginner;
  
  // Generate warm-up sets (typically lighter weight, higher reps)
  const warmUpSets: SetTemplate[] = includeWarmups ? [
    { weight: 0, reps: 15, isWarmUp: true }
  ] : [];
  
  // Generate working sets
  const workingSets: SetTemplate[] = [];
  
  // Ensure at least 2 working sets
  const actualWorkingSets = Math.max(totalSets, 2);
  
  // Create progressive rep scheme
  for (let i = 0; i < actualWorkingSets; i++) {
    // For hypertrophy, use a rep range that decreases slightly with each set
    // Last set has the lowest reps (assuming heavier weight)
    const repTarget = Math.max(min, max - Math.floor(i * (max - min) / actualWorkingSets));
    
    workingSets.push({
      weight: 0, // Will be filled in by user
      reps: repTarget
    });
  }
  
  // Convert set templates to actual Set objects
  return [...warmUpSets, ...workingSets].map(setTemplate => ({
    id: uuidv4(),
    weight: setTemplate.weight,
    reps: setTemplate.reps,
    completed: false,
    isWarmUp: setTemplate.isWarmUp || false,
    // Rest period based on experience level and exercise type
    restMinutes: setTemplate.isWarmUp ? Math.floor(restMinutes / 2) : restMinutes
  }));
};

// Generate sets with deload adjustments
export const generateExerciseSetsWithDeload = (
  exercise: Exercise,
  totalSets: number,
  experience: string,
  isDeloadWeek: boolean = false,
  options?: { phaseType?: string }
): Set[] => {
  // Adjust sets and reps for deload week
  if (isDeloadWeek) {
    // During deload, reduce volume and intensity
    const deloadSets = Math.max(Math.floor(totalSets * 0.7), 2); // Reduce volume by ~30%
    const sets = generateExerciseSets(exercise, deloadSets, experience, 2, true);
    
    // Reduce the target reps slightly to allow for lighter weights
    return sets.map(set => ({
      ...set,
      reps: set.isWarmUp ? set.reps : Math.max(set.reps - 2, 6)
    }));
  }
  
  // Adjust based on phase type
  if (options?.phaseType) {
    const phaseType = options.phaseType;
    let restTime = 2; // default rest time
    
    if (phaseType === 'strength') {
      // For strength: lower reps, longer rest
      const sets = generateExerciseSets(exercise, totalSets, experience, 3, true);
      return sets.map(set => ({
        ...set,
        reps: set.isWarmUp ? set.reps : Math.max(Math.floor(set.reps * 0.7), 4),
        restMinutes: set.isWarmUp ? 1.5 : 3
      }));
    }
    
    if (phaseType === 'hypertrophy') {
      // For hypertrophy: moderate reps, moderate rest
      restTime = 2;
    }
    
    if (phaseType === 'endurance' || phaseType === 'recovery') {
      // For endurance: higher reps, shorter rest
      const sets = generateExerciseSets(exercise, totalSets, experience, 1, true);
      return sets.map(set => ({
        ...set,
        reps: set.isWarmUp ? set.reps : Math.min(set.reps + 3, 20),
        restMinutes: set.isWarmUp ? 0.5 : 1
      }));
    }
  }
  
  // Default: generate regular sets
  return generateExerciseSets(exercise, totalSets, experience, 2, true);
};

export default generateExerciseSets;
