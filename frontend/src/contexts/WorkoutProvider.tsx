
// The actual logic lives here.

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, Workout, WorkoutExercise, CompletedWorkout, Set } from "@/types/workout";
import { v4 as uuidv4 } from 'uuid';
import { defaultWorkouts } from '@/data/defaultWorkouts';
import { exerciseLibrary } from '@/lib/workout/exercises/exerciseManager';
import { WorkoutContext } from './WorkoutContext';
import { workoutActions } from './workout-actions';
import { generateNewWorkoutPlan } from './workout-actions/generatePlan';
import { format } from "date-fns";
import { trackSubgroupTrainingHistory } from '@/lib/workout/exercises/secondaryMuscleMap';

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = useState<Exercise[]>(exerciseLibrary);
  const [workoutPlan, setWorkoutPlan] = useState<Workout[]>(defaultWorkouts);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [volumeStatus, setVolumeStatus] = useState<{ muscleGroup: string; current: number; min: number; moderate: number; max: number; isLow: boolean; isHigh: boolean }[]>([]);
  const [macroCyclePlan, setMacroCyclePlanState] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<any>(null);
  const [subgroupHistory, setSubgroupHistory] = useState<Record<string, { weeksUnderMEV: number, lastWeekTrained: number }>>({});
  const { toast } = useToast();

  useEffect(() => {
    const storedExercises = localStorage.getItem('exercises');
    if (storedExercises) setExercises(JSON.parse(storedExercises));
    const storedWorkoutPlan = localStorage.getItem('workoutPlan');
    if (storedWorkoutPlan) setWorkoutPlan(JSON.parse(storedWorkoutPlan));
    const storedCompletedWorkouts = localStorage.getItem('completedWorkouts');
    if (storedCompletedWorkouts) setCompletedWorkouts(JSON.parse(storedCompletedWorkouts));
    const storedMacroCyclePlan = localStorage.getItem('macroCyclePlan');
    if (storedMacroCyclePlan) setMacroCyclePlanState(JSON.parse(storedMacroCyclePlan));
    const storedSubgroupHistory = localStorage.getItem('subgroupHistory');
    if (storedSubgroupHistory) setSubgroupHistory(JSON.parse(storedSubgroupHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
    localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
    
    // Track subgroup training history
    const updatedHistory = trackSubgroupTrainingHistory(completedWorkouts, exercises, subgroupHistory);
    setSubgroupHistory(updatedHistory);
    localStorage.setItem('subgroupHistory', JSON.stringify(updatedHistory));
    
    // Calculate volume status based on workout plan and completed workouts
    const userPriorityMuscles = currentPhase?.focusMuscleGroups || [];
    const phaseVolumeLevel = currentPhase?.volumeLevel || 'moderate';
    const calculatedVolumeStatus = workoutActions.calculateCurrentVolumeStatus(
      exercises, 
      completedWorkouts,
      [],  // No selected exercises since this is for existing workouts
      userPriorityMuscles,
      currentPhase?.experience || 'beginner',
      phaseVolumeLevel
    );
    setVolumeStatus(calculatedVolumeStatus);
  }, [exercises, workoutPlan, completedWorkouts, currentPhase]);
  
  useEffect(() => {
    if (macroCyclePlan) {
      localStorage.setItem('macroCyclePlan', JSON.stringify(macroCyclePlan));
      
      const today = format(new Date(), "yyyy-MM-dd");
      
      const currentPhase = macroCyclePlan.phases.find((phase: any) => {
        return phase.startDate <= today && phase.endDate >= today;
      });
      
      setCurrentPhase(currentPhase || macroCyclePlan.phases[0]);
    }
  }, [macroCyclePlan]);
  
  const setMacroCyclePlan = (plan: any) => {
    setMacroCyclePlanState(plan);
  };
  
  const boundActions = workoutActions.create({
    exercises, setExercises,
    workoutPlan, setWorkoutPlan,
    completedWorkouts, setCompletedWorkouts,
    currentWorkout, setCurrentWorkout,
    toast
  });

  const calculateCurrentVolumeStatus = (
    selectedExercises: string[] = [], 
    focusMuscleGroups: string[] = [],
    experience: string = 'beginner',
    volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate'
  ) => {
    return workoutActions.calculateCurrentVolumeStatus(
      exercises, 
      completedWorkouts, 
      selectedExercises, 
      focusMuscleGroups,
      experience,
      volumeLevel,
      subgroupHistory // Pass subgroup history to volume calculation
    );
  };

  const generateWorkoutPlan = (
    volumeLevel?: 'minimum' | 'moderate' | 'maximum', 
    selectedExercises?: string[],
    phaseType?: string,
    focusMuscleGroups?: string[]
  ): Workout => {
    const newWorkout = generateNewWorkoutPlan(
      selectedExercises || [],
      phaseType,
      focusMuscleGroups,
      subgroupHistory // Pass subgroup history to plan generation
    );
    
    // Add two initial working sets to each exercise
    newWorkout.exercises = newWorkout.exercises.map(ex => ({
      ...ex,
      sets: [
        { id: uuidv4(), weight: 0, reps: 0, completed: false, isWarmUp: true },
        { id: uuidv4(), weight: 0, reps: 8, completed: false },
        { id: uuidv4(), weight: 0, reps: 8, completed: false }
      ]
    }));
    
    setWorkoutPlan(prev => [...prev, newWorkout]);
    
    return newWorkout;
  };

  const value = {
    exercises,
    workoutPlan,
    completedWorkouts,
    currentWorkout,
    volumeStatus,
    macroCyclePlan,
    currentPhase,
    subgroupHistory,
    setExercises,
    setWorkoutPlan,
    setCompletedWorkouts,
    setCurrentWorkout,
    setMacroCyclePlan,
    calculateCurrentVolumeStatus,
    generateNewWorkoutPlan: generateWorkoutPlan,
    ...boundActions,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
