
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Exercise } from "@/types/workout";

export const useBeginnerRecommendations = (
  exercises: Exercise[],
  selectedExercises: string[],
  onExerciseToggle: (exerciseId: string) => void
) => {
  const { user } = useAuth();
  const [showBeginnersGuide, setShowBeginnersGuide] = useState(false);

  useEffect(() => {
    if (user && user.experience === "beginner") {
      setShowBeginnersGuide(true);
      
      const recommendedExercises = exercises
        .filter(ex => ex.recommended === true)
        .map(ex => ex.id);
        
      recommendedExercises.forEach(id => {
        if (!selectedExercises.includes(id)) {
          onExerciseToggle(id);
        }
      });
    }
  }, [user, exercises, selectedExercises, onExerciseToggle]);

  return { showBeginnersGuide };
};
