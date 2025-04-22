
// Maps exercise names and muscle groups to specific subgroups with consistent Title Case
export const determineSubGroup = (
  exerciseName: string, 
  muscleGroup: string
): string => {
  const name = exerciseName.toLowerCase();
  
  switch (muscleGroup) {
    case 'Biceps':
      // Only return specific subgroups for intermediate and advanced users
      // For beginners, the default will be used
      if (name.includes('hammer') || name.includes('neutral')) {
        return 'Long Head';
      }
      return 'Short Head';
      
    case 'Triceps':
      // Only return specific subgroups for intermediate and advanced users
      // For beginners, the default will be used
      if (name.includes('overhead') || name.includes('french')) {
        return 'Long Head';
      }
      if (name.includes('pushdown') || name.includes('press')) {
        return 'Lateral Head';
      }
      return 'Medial Head';
      
    case 'Chest':
      if (name.includes('incline') || name.includes('upper')) {
        return 'Upper Chest';
      }
      if (name.includes('decline') || name.includes('lower')) {
        return 'Lower Chest';
      }
      return 'Mid Chest';
      
    case 'Back':
      if (name.includes('lat') || name.includes('pulldown') || name.includes('pull-up')) {
        return 'Latissimus Dorsi';
      }
      if (name.includes('row') || name.includes('rhomboid')) {
        return 'Upper Back';
      }
      return 'Lower Back';
      
    case 'Shoulders':
      if (name.includes('lateral') || name.includes('side')) {
        return 'Side Delts';
      }
      if (name.includes('front') || name.includes('anterior')) {
        return 'Front Delts';
      }
      return 'Rear Delts';
      
    case 'Core':
      if (name.includes('crunch') || name.includes('upper')) {
        return 'Upper Abs';
      }
      if (name.includes('leg raise') || name.includes('lower')) {
        return 'Lower Abs';
      }
      return 'Obliques';
      
    case 'Calves':
      return name.includes('seated') ? 'Soleus' : 'Gastrocnemius';
      
    case 'Quads':
      // Only return specific subgroups for advanced users
      // For beginners and intermediate, the default will be used
      if (name.includes('extension')) {
        return 'Rectus Femoris';
      }
      if (name.includes('lunge')) {
        return 'Vastus Medialis';
      }
      return 'Vastus Lateralis';
      
    case 'Hamstrings':
      // Only return specific subgroups for advanced users
      // For beginners and intermediate, the default will be used
      if (name.includes('curl')) {
        return 'Knee Flexion';
      }
      return 'Hip Extension';
      
    case 'Glutes':
      if (name.includes('medius') || name.includes('abduction')) {
        return 'Glute Medius';
      }
      if (name.includes('minimus')) {
        return 'Glute Minimus';
      }
      return 'Glute Maximus';
      
    default:
      return `${muscleGroup} Primary`;
  }
};
