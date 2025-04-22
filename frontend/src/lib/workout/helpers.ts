
// Helper functions for workout generation

// Distribute weekly volume across training days more evenly
export const distributeVolumeAcrossDays = (
  muscleGroup: string,
  totalSets: number,
  frequency: number
): number[] => {
  if (frequency <= 0) return [0];
  if (frequency === 1) return [totalSets];
  
  // Create an array to hold sets per day
  const distribution: number[] = new Array(frequency).fill(0);
  
  // Calculate base sets per day
  const baseSetsPerDay = Math.floor(totalSets / frequency);
  
  // First, distribute base sets evenly
  distribution.fill(baseSetsPerDay);
  
  // Then distribute remaining sets
  const remainingSets = totalSets - (baseSetsPerDay * frequency);
  
  // Prioritize putting more sets on the first training days
  // to ensure progressive overload principles (start with more volume)
  for (let i = 0; i < remainingSets; i++) {
    distribution[i % frequency] += 1;
  }
  
  return distribution;
};

// Get training frequency for a muscle group based on split
export const getTrainingFrequencyPerMuscle = (
  muscleGroup: string,
  split: string[][],
  muscleGroupToWorkoutType: Record<string, string[]>
): number => {
  if (!muscleGroupToWorkoutType[muscleGroup]) return 1;
  
  let frequency = 0;
  const workoutTypes = muscleGroupToWorkoutType[muscleGroup];
  
  split.forEach(dayTypes => {
    // Check if any workout type for this day trains this muscle group
    const trainsOnThisDay = dayTypes.some(type => workoutTypes.includes(type));
    if (trainsOnThisDay) {
      frequency += 1;
    }
  });
  
  // Ensure at least one training day per week
  return Math.max(frequency, 1);
};

// Utility function for random sorting
export const shuffleArray = <T>(array: T[]): T[] => {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};

// Get maximum sets per week for a muscle group based on experience level
export const getMaximumSetsPerWeek = (
  muscleGroup: string,
  experience: 'beginner' | 'intermediate' | 'advanced'
): number => {
  const maximums: Record<string, Record<string, number>> = {
    beginner: {
      chest: 12, back: 14, shoulders: 12, biceps: 10, triceps: 10,
      quads: 12, hamstrings: 10, glutes: 10, calves: 12, core: 10
    },
    intermediate: {
      chest: 16, back: 20, shoulders: 16, biceps: 14, triceps: 14,
      quads: 16, hamstrings: 14, glutes: 14, calves: 16, core: 14
    },
    advanced: {
      chest: 20, back: 24, shoulders: 20, biceps: 16, triceps: 16,
      quads: 20, hamstrings: 16, glutes: 16, calves: 20, core: 18
    }
  };
  
  return maximums[experience]?.[muscleGroup] || 12;
};
