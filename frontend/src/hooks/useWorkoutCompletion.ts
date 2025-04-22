
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import type { CompletedWorkout, Set } from '@/types/workout';

export const useWorkoutCompletion = (
  completedWorkouts: CompletedWorkout[],
  setCompletedWorkouts: (workouts: CompletedWorkout[]) => void,
  setWorkoutPlan: (plan: any[]) => void,
  setCurrentWorkout: (workout: any | null) => void,
  setMuscleGroupProgress: (progress: any[]) => void,
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const adjustWeight = (currentWeight: number, feedback: 'too_easy' | 'just_right' | 'too_hard') => {
    switch (feedback) {
      case 'too_easy':
        return Math.round(currentWeight * 1.05); // 5% increase
      case 'too_hard':
        return Math.round(currentWeight * 0.95); // 5% decrease
      default:
        return currentWeight; // keep the same for 'just_right'
    }
  };

  // Validate if the workout is ready to be completed
  const validateWorkoutCompletion = (workout: any) => {
    if (!workout || !workout.exercises) {
      return { valid: false, message: "No workout or exercises found" };
    }

    for (let i = 0; i < workout.exercises.length; i++) {
      const exercise = workout.exercises[i];
      if (!exercise || !exercise.sets) {
        return { valid: false, message: "Missing exercise data" };
      }

      // Check only working sets (last two sets of each exercise)
      const workingSets = exercise.sets.slice(-2);
      
      for (let j = 0; j < workingSets.length; j++) {
        const set = workingSets[j];
        if (!set.completed) {
          return { 
            valid: false, 
            message: `Complete all sets for ${getExerciseName(i, workout) || 'Exercise ' + (i+1)}` 
          };
        }
        
        if (set.weight <= 0) {
          return { 
            valid: false, 
            message: `Enter weight for all sets in ${getExerciseName(i, workout) || 'Exercise ' + (i+1)}` 
          };
        }
        
        if (set.reps <= 0) {
          return { 
            valid: false, 
            message: `Enter reps for all sets in ${getExerciseName(i, workout) || 'Exercise ' + (i+1)}` 
          };
        }
      }
    }

    return { valid: true, message: "" };
  };

  // Helper to get exercise name for error messages
  const getExerciseName = (index: number, workout: any) => {
    const exerciseId = workout.exercises[index]?.exerciseId;
    if (!exerciseId) return null;
    
    // This would ideally look up from your exercise database
    // For now we just return null and the calling code will use a fallback
    return null;
  };

  const completeWorkout = (currentWorkout: any, feedback?: 'too_easy' | 'just_right' | 'too_hard') => {
    if (!currentWorkout || !user) return;
    
    // Validate workout completion
    const validation = validateWorkoutCompletion(currentWorkout);
    if (!validation.valid) {
      toast({
        title: "Cannot Complete Workout",
        description: validation.message,
        variant: "destructive"
      });
      return false;
    }
    
    const completed: CompletedWorkout = {
      workoutId: currentWorkout.id,
      userId: user.id,
      date: new Date().toISOString(),
      exercises: currentWorkout.exercises.map((exercise: any) => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map((set: Set) => ({
          weight: set.weight,
          reps: set.reps,
          rpe: set.rpe,
          // Only include rir if it exists in the set
          ...(set.rir !== undefined && { rir: set.rir })
        }))
      })),
      feedback
    };
    
    const updatedHistory = [...completedWorkouts, completed];
    setCompletedWorkouts(updatedHistory);
    localStorage.setItem(`workoutHistory-${user.id}`, JSON.stringify(updatedHistory));
    
    if (feedback) {
      const updatedPlan = currentWorkout.exercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: Set) => ({
          ...set,
          weight: adjustWeight(set.weight, feedback)
        }))
      }));
      
      setWorkoutPlan(updatedPlan);
      localStorage.setItem(`workoutPlan-${user.id}`, JSON.stringify(updatedPlan));
    }
    
    let toastMessage = "Workout completed!";
    if (feedback === 'too_easy') {
      toastMessage = "Great job! We'll increase the weights for your next workout.";
    } else if (feedback === 'too_hard') {
      toastMessage = "Thanks for pushing through! We'll adjust the weights for next time.";
    } else if (feedback === 'just_right') {
      toastMessage = "Perfect! We'll keep your progress steady.";
    }
    
    toast({
      title: "Workout Complete",
      description: toastMessage,
    });
    
    setCurrentWorkout(null);
    return true;
  };

  return { completeWorkout };
};
