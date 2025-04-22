
import type { CompletedWorkout, Workout } from '@/types/workout';

export const getNextWorkoutDay = (workouts: Workout[]): number => {
  if (!workouts || workouts.length === 0) {
    return 1;
  }

  const workoutDays = workouts.map(workout => workout.day);
  const maxDay = Math.max(...workoutDays);

  return maxDay + 1;
};

export const calculateTotalSets = (workout: Workout): number => {
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
};

// Update the calculateWeeklyVolume function to properly handle muscle group filtering
// and return a number instead of a Record
export const calculateWeeklyVolume = (
  workouts: CompletedWorkout[],
  muscleGroup?: string
): number => {
  // Get current week's workouts
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start on Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Filter workouts completed this week
  const thisWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= startOfWeek;
  });
  
  // If no muscle group specified, count total sets
  if (!muscleGroup) {
    return thisWeekWorkouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + exercise.sets.filter(set => !set.isWarmUp).length;
      }, 0);
    }, 0);
  }
  
  // If muscle group specified, count sets only for that muscle group
  return thisWeekWorkouts.reduce((total, workout) => {
    return total + workout.exercises.reduce((exerciseTotal, exercise) => {
      // Extract muscle group from exercise ID for more accurate matching
      const muscleFromExerciseId = exercise.exerciseId.split('_')[0];
      
      if (muscleFromExerciseId === muscleGroup) {
        return exerciseTotal + exercise.sets.filter(set => !set.isWarmUp).length;
      }
      return exerciseTotal;
    }, 0);
  }, 0);
};

export const getSplitForDay = (dayIndex: number, splitType: string, selectedDays: string[]) => {
  const numDays = selectedDays.length;

  if (splitType === 'push_pull_legs') {
    if (numDays === 3) {
      return ['push', 'pull', 'legs'][dayIndex % 3];
    } else if (numDays >= 5) {
      return ['push', 'pull', 'legs', 'push', 'pull'][dayIndex % 5];
    }
  } else if (splitType === 'upper_lower') {
    return ['upper', 'lower'][dayIndex % 2];
  } else if (splitType === 'full_body') {
    return 'full';
  }

  return 'custom';
};

export const getSplitDisplayName = (split: string) => {
  if (split === 'push') {
    return 'Push Day';
  } else if (split === 'pull') {
    return 'Pull Day';
  } else if (split === 'legs') {
    return 'Legs Day';
  } else if (split === 'upper') {
    return 'Upper Body';
  } else if (split === 'lower') {
    return 'Lower Body';
  } else if (split === 'full') {
    return 'Full Body';
  }

  return 'Custom Split';
};

export const splitMuscleGroups: { [key: string]: string[] } = {
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps'],
  legs: ['quads', 'hamstrings', 'glutes', 'calves'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  lower: ['quads', 'hamstrings', 'glutes', 'calves'],
  full: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves'],
};

export const dayNames = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const getPushDaySequence = (index: number, split: string, selectedDays: string[]) => {
  if (split === 'push') {
    const pushDays = selectedDays.map((day, i) => getSplitForDay(i, 'push_pull_legs', selectedDays) === 'push' ? i : null).filter(x => x !== null);
    const pushDayIndex = pushDays.indexOf(index);
    return pushDayIndex + 1;
  }
  return 0;
};

export const getPushDaysCount = (selectedDays: string[], splitType: string) => {
  return selectedDays.filter((_, i) => getSplitForDay(i, splitType, selectedDays) === 'push').length;
};
