
import type { Exercise, SubGroup } from "@/types/workout";
import { getSubGroupId } from "./subgroupIdentifier";
import { getSubGroups } from "@/components/workout/getSubGroups";

export function getSubGroupsForMuscleGroup(
  muscleGroup: string,
  exercises: Exercise[],
  isPriority = false,
  daySequence = 1,
  pushDaysCount?: number,
  userExperience: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): SubGroup[] {
  // Filter exercises for this muscle group
  const muscleExercises = exercises.filter(
    (ex) => ex.muscleGroup.toLowerCase() === muscleGroup.toLowerCase()
  );

  if (muscleExercises.length === 0) {
    return [];
  }

  console.log(`Getting subgroups for ${muscleGroup} with experience level: ${userExperience}`);

  // Special handling for quads, hamstrings, and glutes
  if (['quads', 'hamstrings', 'glutes'].includes(muscleGroup.toLowerCase())) {
    return [{
      id: muscleGroup.toLowerCase(),
      name: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1).toLowerCase(),
      exercises: muscleExercises
    }];
  }

  // Use the getSubGroups function from components/workout/getSubGroups
  return getSubGroups(muscleGroup, exercises, isPriority, daySequence, pushDaysCount, userExperience);
}

// Helper function to find all exercises for a specific subgroup
export function getExercisesForSubGroup(
  muscleGroup: string,
  subGroupName: string,
  exercises: Exercise[]
): Exercise[] {
  const normalizedMuscleGroup = muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1).toLowerCase();
  
  // Special handling for quads, hamstrings, and glutes
  if (['Quads', 'Hamstrings', 'Glutes'].includes(normalizedMuscleGroup)) {
    // For these groups, just return all exercises for that muscle group
    return exercises.filter(ex => 
      ex.muscleGroup.toLowerCase() === normalizedMuscleGroup.toLowerCase());
  }
  
  // Add logging to debug biceps filtering
  if (normalizedMuscleGroup === 'Biceps') {
    console.log(`Filtering biceps exercises for subgroup: ${subGroupName}`);
    console.log(`Available biceps exercises:`, exercises.filter(ex => ex.muscleGroup.toLowerCase() === 'biceps'));
  }
  
  return exercises.filter(ex => {
    // Check if muscle group matches (case insensitive)
    if (ex.muscleGroup.toLowerCase() !== normalizedMuscleGroup.toLowerCase()) {
      return false;
    }
    
    // Get subgroup ID using our utility function
    const derivedSubGroup = getSubGroupId(ex);
    
    // For biceps, apply special handling 
    if (normalizedMuscleGroup === 'Biceps') {
      // Normalize the subgroup name for consistency
      const normalizedSubGroupName = subGroupName.replace(/\s+/g, ' ').trim();
      
      // Check all possible variations for matching
      if (derivedSubGroup.toLowerCase().includes(normalizedSubGroupName.toLowerCase())) {
        return true;
      }
      
      if (ex.subGroupId) {
        // Direct match on subGroupId
        if (ex.subGroupId.toLowerCase() === normalizedSubGroupName.toLowerCase() ||
            ex.subGroupId.toLowerCase() === normalizedSubGroupName.replace(/\s+/g, '_').toLowerCase() ||
            ex.subGroupId.toLowerCase().includes(normalizedSubGroupName.toLowerCase().replace(/\s+/g, '_')) ||
            ex.subGroupId.toLowerCase().includes(normalizedSubGroupName.toLowerCase())) {
          return true;
        }
        
        // Special case for long/short head
        if ((normalizedSubGroupName === 'Long Head' && ex.subGroupId.toLowerCase().includes('long')) ||
            (normalizedSubGroupName === 'Short Head' && ex.subGroupId.toLowerCase().includes('short'))) {
          return true;
        }
      }
      
      // Last check for the exercise name itself
      if ((normalizedSubGroupName === 'Long Head' && (ex.name.toLowerCase().includes('hammer') || 
                                                     ex.name.toLowerCase().includes('neutral'))) ||
          (normalizedSubGroupName === 'Short Head' && (ex.name.toLowerCase().includes('preacher') || 
                                                      ex.name.toLowerCase().includes('concentration')))) {
        return true;
      }
      
      return false;
    }
    
    // For other muscle groups, use standard comparison
    return derivedSubGroup.toLowerCase() === subGroupName.toLowerCase() ||
           derivedSubGroup.toLowerCase().includes(subGroupName.toLowerCase());
  });
}

export { getSubGroupId };
