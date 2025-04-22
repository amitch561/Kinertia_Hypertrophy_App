
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import type { Exercise, Workout } from '@/types/workout';

export const useExerciseReplacement = (
  exercises: Exercise[],
  workoutPlan: Workout[],
  currentWorkout: Workout | null,
  setWorkoutPlan: (plan: Workout[]) => void,
  setCurrentWorkout: (workout: Workout | null) => void,
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const replaceExercise = (exerciseIndex: number, newExerciseId: string, replaceForAll: boolean = false) => {
    if (!currentWorkout || !user) return;
    
    const newExerciseDetails = exercises.find(ex => ex.id === newExerciseId);
    if (!newExerciseDetails) return;
    
    const currentExerciseId = currentWorkout.exercises[exerciseIndex].exerciseId;
    
    if (replaceForAll) {
      const updatedPlan = workoutPlan.map(workout => {
        const updatedExercises = workout.exercises.map(exercise => {
          if (exercise.exerciseId === currentExerciseId) {
            return { ...exercise, exerciseId: newExerciseId };
          }
          return exercise;
        });
        
        return { ...workout, exercises: updatedExercises };
      });
      
      setWorkoutPlan(updatedPlan);
      localStorage.setItem(`workoutPlan-${user.id}`, JSON.stringify(updatedPlan));
      
      if (currentWorkout) {
        const updatedCurrentWorkout = {
          ...currentWorkout,
          exercises: currentWorkout.exercises.map((exercise, idx) => {
            if (idx === exerciseIndex) {
              return { ...exercise, exerciseId: newExerciseId };
            }
            return exercise;
          })
        };
        setCurrentWorkout(updatedCurrentWorkout);
      }
      
      toast({
        title: "Exercise replaced in all workouts",
        description: `${newExerciseDetails.name} will now be used in all workouts.`,
      });
    } else {
      const updatedWorkout = {
        ...currentWorkout,
        exercises: currentWorkout.exercises.map((exercise, idx) => {
          if (idx === exerciseIndex) {
            return { ...exercise, exerciseId: newExerciseId };
          }
          return exercise;
        })
      };
      
      setCurrentWorkout(updatedWorkout);
      
      toast({
        title: "Exercise replaced",
        description: `Changed to ${newExerciseDetails.name} for this workout.`,
      });
    }
  };

  return { replaceExercise };
};
