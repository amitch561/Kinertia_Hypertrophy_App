
import type { SubGroupMetadata } from '@/types/workout';

export const subGroupMetadata: Record<string, SubGroupMetadata> = {
  // Chest subgroups
  'chest_upper': { name: 'Upper Chest', primaryGroup: 'Chest', secondaryWith: ['Shoulders'] },
  'chest_mid': { name: 'Mid Chest', primaryGroup: 'Chest', secondaryWith: ['Shoulders', 'Triceps'] },
  'chest_lower': { name: 'Lower Chest', primaryGroup: 'Chest', secondaryWith: ['Shoulders', 'Triceps'] },
  
  // Back subgroups
  'lats': { name: 'Lats', primaryGroup: 'Back', secondaryWith: ['Biceps'] },
  'back_upper': { name: 'Upper Back', primaryGroup: 'Back', secondaryWith: ['Rear Delts'] },
  'back_mid': { name: 'Mid Back', primaryGroup: 'Back', secondaryWith: ['Rear Delts'] },
  'back_lower': { name: 'Lower Back', primaryGroup: 'Back', secondaryWith: ['Core'] },
  
  // Shoulders subgroups
  'front_delts': { name: 'Front Delts', primaryGroup: 'Shoulders', secondaryWith: ['Chest'] },
  'side_delts': { name: 'Side Delts', primaryGroup: 'Shoulders', secondaryWith: [] },
  'rear_delts': { name: 'Rear Delts', primaryGroup: 'Shoulders', secondaryWith: ['Back'] },
  
  // Arms subgroups
  'biceps_long_head': { name: 'Long Head', primaryGroup: 'Biceps', secondaryWith: [] },
  'biceps_short_head': { name: 'Short Head', primaryGroup: 'Biceps', secondaryWith: [] },
  'triceps_long_head': { name: 'Long Head', primaryGroup: 'Triceps', secondaryWith: ['Shoulders'] },
  'triceps_lateral_head': { name: 'Lateral Head', primaryGroup: 'Triceps', secondaryWith: [] },
  'triceps_medial_head': { name: 'Medial Head', primaryGroup: 'Triceps', secondaryWith: [] },
  
  // Legs subgroups
  'quadriceps': { name: 'Quadriceps', primaryGroup: 'Legs', secondaryWith: ['Glutes'] },
  'hamstrings': { name: 'Hamstrings', primaryGroup: 'Legs', secondaryWith: ['Glutes', 'Lower Back'] },
  'glutes': { name: 'Glutes', primaryGroup: 'Legs', secondaryWith: ['Hamstrings'] },
  'calves': { name: 'Calves', primaryGroup: 'Legs', secondaryWith: [] },
  'adductors': { name: 'Adductors', primaryGroup: 'Legs', secondaryWith: ['Glutes'] },
  'abductors': { name: 'Abductors', primaryGroup: 'Legs', secondaryWith: ['Glutes'] },
  
  // Core subgroups
  'upper_abs': { name: 'Upper Abs', primaryGroup: 'Core', secondaryWith: [] },
  'lower_abs': { name: 'Lower Abs', primaryGroup: 'Core', secondaryWith: [] },
  'obliques': { name: 'Obliques', primaryGroup: 'Core', secondaryWith: [] },
  'transverse_abdominis': { name: 'Transverse Abdominis', primaryGroup: 'Core', secondaryWith: [] },
  'core_lower_back': { name: 'Lower Back', primaryGroup: 'Core', secondaryWith: ['Back'] },
  
  // Forearm subgroups
  'forearm_flexors': { name: 'Flexors', primaryGroup: 'Forearms', secondaryWith: [] },
  'forearm_extensors': { name: 'Extensors', primaryGroup: 'Forearms', secondaryWith: [] }
};
