import { useState, useEffect } from "react";
import { Workout } from "@/types/workout";
import { useToast } from "@/components/ui/toast-hook";

export const useWorkoutPage = (currentWorkout: Workout | null, exercises: any[]) => {
  const { toast } = useToast();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const getExerciseDetails = (exerciseId: string) => {
    return exercises.find(ex => ex.id === exerciseId);
  };

  const calculateCompletionPercentage = () => {
    if (!currentWorkout || !currentWorkout.exercises) return 0;
    const totalExercises = currentWorkout.exercises.length;
    const completedExercises = currentWorkout.exercises.filter(exercise => {
      if (!exercise || !exercise.sets) return false;
      return exercise.sets.every(set => set.completed);
    }).length;
    return (completedExercises / totalExercises) * 100;
  };

  const isGroupCompleted = (groupExercises: { exercise: any; details: any }[]) => {
    return groupExercises.every(({ exercise }) => {
      if (!exercise || !exercise.sets) return false;
      return exercise.sets.every(set => set.completed);
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
    getExerciseDetails,
    calculateCompletionPercentage,
    isGroupCompleted
  };
};
