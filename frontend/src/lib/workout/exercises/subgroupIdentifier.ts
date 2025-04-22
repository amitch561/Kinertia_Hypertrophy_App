
import type { Exercise } from '@/types/workout';
import { determineSubGroup } from './subgroupMapping';

// Helper function to get consistently formatted subgroup ID from an Exercise object
export const getSubGroupId = (exercise: Exercise): string => {
  // If the exercise has the new subGroup structure
  if (exercise.subGroup && typeof exercise.subGroup === 'object') {
    // Get the name and convert it to Title Case format
    const name = exercise.subGroup.name;
    if (name) {
      // Special case for biceps
      if (name.toLowerCase().includes('long')) return 'Long Head';
      if (name.toLowerCase().includes('short')) return 'Short Head';
    }
  }
  
  // Direct subGroupId takes precedence if it exists
  if (exercise.subGroupId) {
    // Handle direct mappings for biceps specifically
    const muscleGroup = exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1).toLowerCase();
    const formattedId = exercise.subGroupId.charAt(0).toUpperCase() + exercise.subGroupId.slice(1).toLowerCase();
    
    // Special case for biceps
    if (muscleGroup === 'Biceps') {
      if (formattedId.toLowerCase().includes('long')) {
        return 'Long Head';
      }
      if (formattedId.toLowerCase().includes('short')) {
        return 'Short Head';
      }
    }
    
    // Special case for triceps to ensure consistent casing
    if (muscleGroup === 'Triceps') {
      if (formattedId.toLowerCase().includes('long')) {
        return 'Long Head';
      }
      if (formattedId.toLowerCase().includes('lateral')) {
        return 'Lateral Head';
      }
      if (formattedId.toLowerCase().includes('medial')) {
        return 'Medial Head';
      }
    }
    
    return formattedId;
  }
  
  // Use determineSubGroup for fallback (imported at the top instead of using require)
  return determineSubGroup(exercise.name, exercise.muscleGroup);
};
