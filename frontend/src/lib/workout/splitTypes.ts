
export const splitMuscleGroups = {
  full_body: [
    ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'],
    ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'],
    ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core']
  ],
  upper_lower: [
    ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    ['quads', 'hamstrings', 'glutes', 'calves', 'core'],
    ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    ['quads', 'hamstrings', 'glutes', 'calves', 'core']
  ],
  push_pull_legs: [
    ['chest', 'shoulders', 'triceps'],
    ['back', 'biceps'],
    ['quads', 'hamstrings', 'glutes', 'calves'],
    ['chest', 'shoulders', 'triceps'],
    ['back', 'biceps'],
    ['quads', 'hamstrings', 'glutes', 'calves']
  ]
};

export const getSplitName = (
  splitType: 'full_body' | 'upper_lower' | 'push_pull_legs', 
  dayIndex: number
): string => {
  switch (splitType) {
    case 'full_body':
      return `Full Body - Day ${dayIndex + 1}`;
    case 'upper_lower':
      return dayIndex % 2 === 0 ? 'Upper Body' : 'Lower Body';
    case 'push_pull_legs':
      if (dayIndex % 3 === 0) return 'Push (Chest, Shoulders, Triceps)';
      if (dayIndex % 3 === 1) return 'Pull (Back, Biceps)';
      return 'Legs (Quads, Hamstrings, Glutes)';
    default:
      return `Workout ${dayIndex + 1}`;
  }
};
