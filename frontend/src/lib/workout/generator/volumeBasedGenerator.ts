
import { v4 as uuidv4 } from 'uuid';
import type { Exercise, Workout } from '@/types/workout';
import type { WorkoutPlanOptions } from './types';
import { calculateTargetSets } from './utils/volumeCalculator';
import { determineSplitType, getMuscleGroupsForSplit, getTrainingFrequencyForMuscle } from './utils/splitTypeUtils';
import { selectExercisesForWorkout } from './utils/exerciseSelectionUtils';
import generateExerciseSets, { generateExerciseSetsWithDeload } from '../generateExerciseSets';

// Define valid muscle group type
type ValidMuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 
                        'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core';

// Generate a workout plan based on volume guidelines
export const generateVolumeBasedWorkoutPlan = (
  exercises: Exercise[],
  options: WorkoutPlanOptions
): Workout[] => {
  const {
    experience = 'beginner',
    availableDays,
    equipment = [],
    priorityMuscles = [],
    volumeLevel = 'moderate',
    selectedExercises = [],
    currentWeek = 1,
    phaseType,
    subgroupHistory
  } = options;
  
  // Determine days per week
  const daysPerWeek = typeof availableDays === 'number' 
    ? availableDays 
    : Array.isArray(availableDays) ? availableDays.length : 3;
    
  // Determine split type based on available days
  const splitType = determineSplitType(daysPerWeek);
  
  // Initialize workouts array
  const workouts: Workout[] = [];
  
  // Calculate target sets for each muscle group
  const muscleGroups: ValidMuscleGroup[] = [
    'chest', 'back', 'shoulders', 'biceps', 'triceps', 
    'quads', 'hamstrings', 'glutes', 'calves', 'core'
  ];
  
  // Map to store weekly volume targets for each muscle group
  const weeklyVolumeTargets: Record<string, number> = {};
  
  // Calculate weekly volume targets for each muscle group
  muscleGroups.forEach(muscleGroup => {
    const isPriorityMuscle = priorityMuscles.includes(muscleGroup);
    
    weeklyVolumeTargets[muscleGroup] = calculateTargetSets(
      muscleGroup, 
      options, 
      isPriorityMuscle
    );
    
    // Log the targets for debugging
    console.log(`Weekly target sets for ${muscleGroup}: ${weeklyVolumeTargets[muscleGroup]} (volumeLevel: ${volumeLevel})`);
  });
  
  // Create workouts for each day
  for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
    // Determine which muscle groups to train on this day
    const dayMuscleGroups = getMuscleGroupsForSplit(splitType, dayIndex);
    
    // Create a new workout
    const workout: Workout = {
      id: uuidv4(),
      day: dayIndex + 1,
      name: `${splitType.replace(/_/g, ' ')} Day ${dayIndex + 1}`,
      exercises: [],
      phaseType,
      focusMuscleGroups: priorityMuscles
    };
    
    // Add exercises for each muscle group
    dayMuscleGroups.forEach(muscleGroup => {
      // Determine frequency for this muscle group
      const frequency = getTrainingFrequencyForMuscle(muscleGroup, daysPerWeek, splitType);
      
      // Skip if no sets needed (can happen for some muscles in some splits)
      if (frequency === 0) return;
      
      // Weekly target sets for this muscle group
      const weeklyTargetSets = weeklyVolumeTargets[muscleGroup] || 0;
      
      console.log(`${muscleGroup}: Weekly target ${weeklyTargetSets} / frequency ${frequency}`);
      
      // Calculate sets per workout based on frequency
      const setsPerWorkout = Math.ceil(weeklyTargetSets / frequency);
      
      // Cap sets per workout to avoid excessive volume in one session
      // Research suggests 4-14 sets per muscle per session is ideal depending on experience
      const maxSetsPerSession = experience === 'advanced' ? 14 : experience === 'intermediate' ? 12 : 10;
      const cappedSetsPerWorkout = Math.min(setsPerWorkout, maxSetsPerSession);
      
      // Skip if no sets needed for this workout
      if (cappedSetsPerWorkout <= 0) return;
      
      // Get exercises for this muscle group, either user-selected or recommended
      const userSelectedForMuscle = selectedExercises.length > 0 
        ? exercises.filter(ex => 
            ex.muscleGroup === muscleGroup && 
            selectedExercises.includes(ex.id)
          )
        : [];
        
      // If user selected exercises, use those; otherwise select appropriate exercises
      const workoutExercises = userSelectedForMuscle.length > 0
        ? userSelectedForMuscle
        : selectExercisesForWorkout(
            exercises,
            muscleGroup,
            experience,
            volumeLevel,
            equipment,
            selectedExercises,
            subgroupHistory // Pass subgroup history for prioritization
          );
      
      // Skip if no exercises available for this muscle group
      if (workoutExercises.length === 0) return;
      
      // Distribute sets among exercises
      const exerciseCount = workoutExercises.length;
      const baseSetsPerExercise = Math.floor(cappedSetsPerWorkout / exerciseCount);
      const remainingSets = cappedSetsPerWorkout % exerciseCount;
      
      console.log(`${muscleGroup}: ${cappedSetsPerWorkout} sets across ${exerciseCount} exercises (${baseSetsPerExercise} per exercise + ${remainingSets} remainder)`);
      
      // Add each exercise to the workout
      workoutExercises.forEach((exercise, idx) => {
        // Determine sets for this exercise
        const exerciseSets = baseSetsPerExercise + (idx < remainingSets ? 1 : 0);
        
        // Skip if no sets for this exercise
        if (exerciseSets <= 0) return;
        
        console.log(`Adding ${exercise.name} with ${exerciseSets} sets`);
        
        // Generate sets with appropriate deload adjustments
        const sets = generateExerciseSetsWithDeload(
          exercise,
          exerciseSets,
          experience,
          currentWeek % 5 === 0, // deload if week 5, 10, etc.
          phaseType ? { phaseType } : undefined
        );
        
        // Add exercise to workout
        workout.exercises.push({
          exerciseId: exercise.id,
          sets,
          previousPerformance: []
        });
      });
    });
    
    // Add the workout to the plan
    workouts.push(workout);
  }
  
  return workouts;
};
