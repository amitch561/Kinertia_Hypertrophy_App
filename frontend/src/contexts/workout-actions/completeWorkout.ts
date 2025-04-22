
import type { Workout, CompletedWorkout, Set } from "@/types/workout";

// Validates and completes the current workout
export const completeWorkout = (
  currentWorkout: Workout | null,
  completedWorkouts: CompletedWorkout[],
  setCompletedWorkouts: (workouts: CompletedWorkout[]) => void,
  setCurrentWorkout: (w: Workout | null) => void,
  toast: any,
  feedback: 'too_easy' | 'just_right' | 'too_hard'
) => {
  if (!currentWorkout) {
    toast({
      title: "No current workout",
      description: "Please select a workout to complete.",
      variant: "destructive",
    });
    return false;
  }

  const completionDate = new Date().toISOString();
  const completedWorkout: CompletedWorkout = {
    workoutId: currentWorkout.id,
    userId: "user123",
    date: completionDate,
    exercises: currentWorkout.exercises || [],
    feedback,
  };

  setCompletedWorkouts([...completedWorkouts, completedWorkout]);
  setCurrentWorkout(null);

  toast({
    title: "Workout Completed!",
    description: `You crushed ${currentWorkout.name} on ${new Date(completionDate).toLocaleDateString()}!`,
  });
  return true;
};
