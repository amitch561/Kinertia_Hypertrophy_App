
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Exercise } from "@/types/workout";
import { getPushDaySequence, getPushDaysCount } from "@/utils/workoutDayUtils";

export const useShoulderBalancing = (
  exercises: Exercise[],
  selectedExercises: string[],
  selectedDays: string[],
  splitType: string,
  onExerciseToggle: (exerciseId: string) => void
) => {
  const { user } = useAuth();
  const [shoulderFocusOverride, setShouldFocusOverride] = useState(false);

  useEffect(() => {
    if (user && user.experience === "beginner") {
      setShouldFocusOverride(false);
    }
  }, [user]);

  const handleShoulderFocusToggle = (exerciseId: string, pushDayIndex: number) => {
    // Only handle balancing if user has at least 2 push days and hasn't enabled manual override
    const pushDaysCount = getPushDaysCount(selectedDays, splitType);
    if (pushDaysCount < 2 || shoulderFocusOverride) {
      onExerciseToggle(exerciseId);
      return;
    }

    const selectedExercise = exercises.find(ex => ex.id === exerciseId);
    if (!selectedExercise || selectedExercise.muscleGroup !== 'shoulders') {
      onExerciseToggle(exerciseId);
      return;
    }

    // If exercise is already selected and we're unselecting, just unselect it
    if (selectedExercises.includes(exerciseId)) {
      onExerciseToggle(exerciseId);
      return;
    }

    // Find if we're selecting a lateral or rear delt exercise
    const exerciseName = selectedExercise.name.toLowerCase();
    const isLateralFocus = exerciseName.includes('lateral');
    const isRearFocus = exerciseName.includes('rear') || exerciseName.includes('bent') || exerciseName.includes('reverse');
    
    // Find all current selected shoulder exercises
    const selectedShoulderExercises = exercises
      .filter(ex => ex.muscleGroup === 'shoulders' && selectedExercises.includes(ex.id))
      .map(ex => ({ 
        id: ex.id, 
        name: ex.name.toLowerCase(),
        isLateral: ex.name.toLowerCase().includes('lateral'),
        isRear: ex.name.toLowerCase().includes('rear') || 
                ex.name.toLowerCase().includes('bent') || 
                ex.name.toLowerCase().includes('reverse')
      }));

    // Auto-balance for multiple push days
    selectedDays.forEach((_, index) => {
      const currentPushDaySequence = getPushDaySequence(index, 'push', selectedDays);
      
      if (currentPushDaySequence === pushDayIndex) {
        // Deselect any existing shoulder exercises for this day
        const currentDayExercises = exercises.filter(ex => 
          ex.muscleGroup === 'shoulders' && 
          selectedExercises.includes(ex.id)
        );
        currentDayExercises.forEach(ex => {
          if (selectedExercises.includes(ex.id)) {
            onExerciseToggle(ex.id);
          }
        });
      } else if (currentPushDaySequence) {
        // Handle other push days
        const otherDayShoulderExercises = exercises.filter(ex => 
          ex.muscleGroup === 'shoulders' && 
          selectedExercises.includes(ex.id)
        );
        
        otherDayShoulderExercises.forEach(ex => {
          const exName = ex.name.toLowerCase();
          const exIsLateral = exName.includes('lateral');
          const exIsRear = exName.includes('rear') || exName.includes('bent') || exName.includes('reverse');
          
          if ((isLateralFocus && exIsLateral) || (isRearFocus && exIsRear)) {
            onExerciseToggle(ex.id);
            
            const recommendedReplacement = exercises.find(replacement => 
              replacement.muscleGroup === 'shoulders' && 
              replacement.recommended === true &&
              ((isLateralFocus && (replacement.name.toLowerCase().includes('rear') || 
                                  replacement.name.toLowerCase().includes('bent') || 
                                  replacement.name.toLowerCase().includes('reverse'))) ||
               (isRearFocus && replacement.name.toLowerCase().includes('lateral')))
            );
            
            if (recommendedReplacement) {
              onExerciseToggle(recommendedReplacement.id);
            }
          }
        });
      }
    });
    
    // Finally, select the new exercise
    onExerciseToggle(exerciseId);
  };

  return {
    shoulderFocusOverride,
    setShouldFocusOverride,
    handleShoulderFocusToggle
  };
};
