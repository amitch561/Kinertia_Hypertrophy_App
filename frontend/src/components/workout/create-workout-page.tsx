
import React, { useState, useEffect } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useAuth } from "@/contexts/AuthContext";
import CreateWorkoutHeader from "./CreateWorkoutHeader";
import ExerciseSelectionStep from "./ExerciseSelectionStep";
import { useToast } from "@/hooks/use-toast";
import { secondaryMuscleMap } from "@/lib/workout/exercises/secondaryMuscleMap";

const CreateWorkoutPage = () => {
  const { exercises, addExerciseToWorkout } = useWorkout();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tempWorkoutId] = useState<string>(`temp-${Date.now()}`);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [skipSubGroups, setSkipSubGroups] = useState<Record<string, string[]>>({});

  // Enhanced logic for identifying secondary muscle groups
  useEffect(() => {
    if (selectedExercises.length > 0) {
      const secondaryHit: Record<string, string[]> = {};
      
      selectedExercises.forEach(exId => {
        // Check for chest exercises affecting front delts
        if (exId.includes('bench_press') || 
            exId.includes('dumbbell_press') || 
            exId.includes('pushup')) {
          if (!secondaryHit['Shoulders']) {
            secondaryHit['Shoulders'] = [];
          }
          if (!secondaryHit['Shoulders'].includes('Front Delts')) {
            secondaryHit['Shoulders'].push('Front Delts');
          }
        }
        
        // Check for back exercises affecting biceps
        if (exId.includes('row') || 
            exId.includes('pull') || 
            exId.includes('lat')) {
          if (!secondaryHit['Biceps']) {
            secondaryHit['Biceps'] = [];
          }
          secondaryHit['Biceps'] = ['Long Head', 'Short Head'];
        }
        
        // Add any additional secondary muscles from the map
        const secondaryMuscles = secondaryMuscleMap[exId] || [];
        secondaryMuscles.forEach(muscle => {
          // Capitalize muscle group names
          const capitalizedMuscle = muscle.charAt(0).toUpperCase() + muscle.slice(1);
          if (!secondaryHit[capitalizedMuscle]) {
            secondaryHit[capitalizedMuscle] = [];
          }
        });
      });
      
      setSkipSubGroups(secondaryHit);
    } else {
      setSkipSubGroups({});
    }
  }, [selectedExercises]);

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      }
      return [...prev, exerciseId];
    });
    
    addExerciseToWorkout(tempWorkoutId, exerciseId);
  };

  // Get a list of muscle groups from the available exercises
  const getMuscleGroups = () => {
    const muscleGroups = new Set<string>();
    exercises.forEach(ex => muscleGroups.add(ex.muscleGroup));
    return Array.from(muscleGroups);
  };

  return (
    <div className="container mx-auto p-6 bg-[#221F26] min-h-screen">
      <CreateWorkoutHeader />
      <ExerciseSelectionStep
        muscleGroups={getMuscleGroups()}
        selectedExercises={selectedExercises}
        onExerciseToggle={handleSelectExercise}
        splitType="push_pull_legs"
        selectedDays={['mon', 'tue', 'wed', 'thu', 'fri']}
        userExperience={user?.experience || 'beginner'}
        volumeLevel="moderate"
        skipSubGroups={skipSubGroups}
      />
    </div>
  );
};

export default CreateWorkoutPage;
