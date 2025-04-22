
import { useState, useEffect } from "react";
import { Exercise, Set, WorkoutExercise } from "@/types/workout";
import { useToast } from "@/components/ui/toast-hook";

export const useWorkoutPage = (
  currentWorkout: any,
  exercises: Exercise[],
) => {
  const { toast } = useToast();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number | null>(null);
  const [exerciseToReplace, setExerciseToReplace] = useState<number | null>(null);

  const getExerciseDetails = (exerciseId: string): Exercise | undefined => {
    if (!exerciseId || !exercises || exercises.length === 0) return undefined;
    const exerciseDetails = exercises.find(ex => ex.id === exerciseId);
    
    if (!exerciseDetails) {
      console.warn(`Exercise details not found for ID: ${exerciseId}`);
    }
    
    return exerciseDetails;
  };

  const calculateCompletionPercentage = (): number => {
    if (!currentWorkout || !currentWorkout.exercises) return 0;
    
    const totalWorkingSets = currentWorkout.exercises.reduce((total: number, exercise: WorkoutExercise) => {
      if (!exercise || !exercise.sets) return total;
      return total + 2;
    }, 0);
    
    const completedWorkingSets = currentWorkout.exercises.reduce(
      (total: number, exercise: WorkoutExercise) => {
        if (!exercise || !exercise.sets) return total;
        return total + (exercise.sets.slice(-2).filter(set => set.completed) || []).length;
      }, 
      0
    );
    
    return totalWorkingSets > 0 ? Math.round((completedWorkingSets / totalWorkingSets) * 100) : 0;
  };

  const isGroupCompleted = (exercises: { exercise: WorkoutExercise; details: Exercise }[]): boolean => {
    if (!exercises || exercises.length === 0) return false;
    
    return exercises.every(({ exercise }) => {
      if (!exercise || !exercise.sets) return false;
      const workingSets = exercise.sets.slice(-2);
      return workingSets.length > 0 && workingSets.every(set => set.completed);
    });
  };

  useEffect(() => {
    if (calculateCompletionPercentage() === 100) {
      toast({
        title: "Workout Complete!",
        description: "Great job completing all exercises.",
      });
    }
  }, [calculateCompletionPercentage, toast]);

  return {
    showFeedbackDialog,
    setShowFeedbackDialog,
    currentGroupIndex,
    setCurrentGroupIndex,
    exerciseToReplace,
    setExerciseToReplace,
    getExerciseDetails,
    calculateCompletionPercentage,
    isGroupCompleted,
  };
};
