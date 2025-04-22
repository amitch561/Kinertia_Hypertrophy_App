
import { useState, useEffect } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Workout } from '@/types/workout';
import { DEFAULT_VOLUME_LANDMARKS } from './progressive-overload/types';
import type { RecoveryFeedback, VolumeLandmark } from './progressive-overload/types';
import { calculateRecoveryScore } from './progressive-overload/recoveryUtils';
import { useRecoveryFeedback } from './progressive-overload/useRecoveryFeedback';

export const useProgressiveOverload = () => {
  const { user } = useAuth();
  const { workoutPlan, currentWorkout, exercises, setWorkoutPlan } = useWorkout();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [volumeLandmarks] = useState<VolumeLandmark[]>(DEFAULT_VOLUME_LANDMARKS);
  const [isDeloadWeek, setIsDeloadWeek] = useState(false);
  const { recoveryFeedback, updateRecoveryFeedback } = useRecoveryFeedback();

  // Calculate current week based on completed workouts
  useEffect(() => {
    if (workoutPlan.length > 0) {
      const weekCount = Math.floor(workoutPlan.length / 3) + 1;
      setCurrentWeek(weekCount);
      setIsDeloadWeek(weekCount % 5 === 0);
    }
  }, [workoutPlan]);

  // Initialize recovery feedback for muscle groups in the current workout
  useEffect(() => {
    if (currentWorkout) {
      const uniqueMuscleGroups = new Set<string>();
      
      currentWorkout.exercises.forEach(exercise => {
        const exerciseDetails = exercises.find(ex => ex.id === exercise.exerciseId);
        if (exerciseDetails) {
          uniqueMuscleGroups.add(exerciseDetails.muscleGroup);
        }
      });
      
      Array.from(uniqueMuscleGroups).forEach(muscleGroup => {
        if (!recoveryFeedback.find(f => f.muscleGroup === muscleGroup)) {
          updateRecoveryFeedback(muscleGroup, 'rir', 2);
        }
      });
    }
  }, [currentWorkout, exercises]);

  const progressToNextWeek = () => {
    setCurrentWeek(prev => prev + 1);
  };

  return {
    recoveryFeedback,
    updateRecoveryFeedback,
    progressToNextWeek,
    currentWeek,
    isDeloadWeek,
    volumeLandmarks
  };
};
