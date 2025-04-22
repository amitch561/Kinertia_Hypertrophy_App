
import { Exercise, SubGroup } from "@/types/workout";
import { getSubGroupId } from "@/lib/workout/exercises/subgroupIdentifier";
import { getDefaultSubGroups } from "./getDefaultSubGroups";
import { formatSubGroupName } from "./formatSubGroupName";

export const getSubGroups = (
  muscleGroup: string,
  exercises: Exercise[],
  isPriority = false,
  daySequence = 1,
  pushDaysCount?: number,
  userExperience: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): SubGroup[] => {
  // Normalize the muscle group name for consistent matching
  const normalizedMuscleGroup = muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1).toLowerCase();
  
  // Special case for legs - directly return default subgroups
  if (['Quads', 'Hamstrings', 'Glutes'].includes(normalizedMuscleGroup)) {
    return getDefaultSubGroups(normalizedMuscleGroup, exercises, isPriority, daySequence, pushDaysCount, userExperience);
  }
  
  // Get all exercises for this muscle group
  const muscleExercises = exercises.filter(e => {
    const normalizedExerciseMuscleGroup = e.muscleGroup.charAt(0).toUpperCase() + e.muscleGroup.slice(1).toLowerCase();
    return normalizedExerciseMuscleGroup === normalizedMuscleGroup;
  });

  // Special handling for biceps/triceps based on experience level
  if ((normalizedMuscleGroup === 'Biceps' || normalizedMuscleGroup === 'Triceps') && userExperience === 'beginner') {
    console.log(`Using simplified subgroups for ${normalizedMuscleGroup} (beginner user)`);
    return getDefaultSubGroups(normalizedMuscleGroup, muscleExercises, isPriority, daySequence, pushDaysCount, userExperience);
  }
  
  // Special handling for biceps (intermediate and advanced)
  if (normalizedMuscleGroup === 'Biceps' && userExperience !== 'beginner') {
    console.log(`Found ${muscleExercises.length} biceps exercises for ${userExperience} user`);
    
    // Create standard subgroups for biceps
    const longHeadExercises = muscleExercises.filter(e => {
      const subGroupId = getSubGroupId(e);
      console.log(`Exercise ${e.name}: Subgroup ID = ${subGroupId}`);
      return subGroupId === 'Long Head' || 
             (e.subGroupId && e.subGroupId.toLowerCase().includes('long'));
    });
    
    const shortHeadExercises = muscleExercises.filter(e => {
      const subGroupId = getSubGroupId(e);
      return subGroupId === 'Short Head' || 
             (e.subGroupId && e.subGroupId.toLowerCase().includes('short'));
    });
    
    console.log(`Found ${longHeadExercises.length} Long Head and ${shortHeadExercises.length} Short Head exercises`);
    
    // Always return both subgroups, even if empty
    return [
      {
        id: 'Long Head',
        name: 'Long Head',
        exercises: longHeadExercises
      },
      {
        id: 'Short Head',
        name: 'Short Head',
        exercises: shortHeadExercises
      }
    ];
  }
  
  // Extract unique subgroup IDs using the consistent formatting
  const subGroupIds = new Set<string>();
  muscleExercises.forEach(exercise => {
    const subGroupId = getSubGroupId(exercise);
    if (!subGroupId.toLowerCase().includes('general')) {
      subGroupIds.add(subGroupId);
    }
  });
  
  // If no valid subgroups found, use default mapping
  if (subGroupIds.size === 0) {
    return getDefaultSubGroups(normalizedMuscleGroup, muscleExercises, isPriority, daySequence, pushDaysCount, userExperience);
  }
  
  // Create subgroups with properly formatted names
  const result: SubGroup[] = [];
  
  Array.from(subGroupIds).sort().forEach(subGroupId => {
    const subExercises = muscleExercises.filter(e => getSubGroupId(e) === subGroupId);
    if (subExercises.length > 0) {
      result.push({
        id: subGroupId,
        name: formatSubGroupName(subGroupId, normalizedMuscleGroup),
        exercises: subExercises
      });
    }
  });
  
  return result;
};
