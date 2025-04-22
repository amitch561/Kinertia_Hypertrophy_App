
export function formatSubGroupName(subGroupId: string, muscleGroup: string): string {
  // Handle muscle group specific formatting
  switch (muscleGroup.toLowerCase()) {
    case 'back':
      switch (subGroupId.toLowerCase()) {
        case 'lats': return 'Lats';
        case 'back_upper': return 'Upper Back';
        case 'back_mid': return 'Mid Back';
        case 'back_lower': return 'Lower Back';
      }
      break;
    
    case 'chest':
      switch (subGroupId.toLowerCase()) {
        case 'chest_upper': return 'Upper Chest';
        case 'chest_mid': return 'Mid Chest';
        case 'chest_lower': return 'Lower Chest';
      }
      break;
    
    case 'shoulders':
      switch (subGroupId.toLowerCase()) {
        case 'front_delts': return 'Front Delts';
        case 'side_delts': return 'Side Delts';
        case 'rear_delts': return 'Rear Delts';
      }
      break;
    
    case 'biceps':
      switch (subGroupId.toLowerCase()) {
        case 'biceps_long_head': return 'Long Head';
        case 'biceps_short_head': return 'Short Head';
      }
      break;
    
    case 'triceps':
      switch (subGroupId.toLowerCase()) {
        case 'triceps_long_head': return 'Long Head';
        case 'triceps_lateral_head': return 'Lateral Head';
        case 'triceps_medial_head': return 'Medial Head';
      }
      break;

    case 'core':
      switch (subGroupId.toLowerCase()) {
        case 'upper_abs': return 'Upper Abs';
        case 'lower_abs': return 'Lower Abs';
        case 'obliques': return 'Obliques';
        case 'transverse_abdominis': return 'Transverse Abdominis';
        case 'core_lower_back': return 'Lower Back';
      }
      break;

    case 'forearms':
      switch (subGroupId.toLowerCase()) {
        case 'forearm_flexors': return 'Flexors';
        case 'forearm_extensors': return 'Extensors';
      }
      break;
  }
  
  // For any unmatched subgroup, use Title Case formatting
  return subGroupId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
