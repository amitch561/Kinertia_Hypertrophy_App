
import { useState } from 'react';
import { Workout, CompletedWorkout, Exercise, MuscleGroupProgress, VolumeStatus } from '@/types/workout';

export const useWorkoutState = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [muscleGroupProgress, setMuscleGroupProgress] = useState<MuscleGroupProgress[]>([]);
  const [weeklyVolume, setWeeklyVolume] = useState<Record<string, number>>({});
  const [volumeStatus, setVolumeStatus] = useState<VolumeStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return {
    exercises,
    setExercises,
    workoutPlan,
    setWorkoutPlan,
    completedWorkouts,
    setCompletedWorkouts,
    currentWorkout,
    setCurrentWorkout,
    muscleGroupProgress,
    setMuscleGroupProgress,
    weeklyVolume,
    setWeeklyVolume,
    volumeStatus,
    setVolumeStatus,
    isLoading,
    setIsLoading,
  };
};
