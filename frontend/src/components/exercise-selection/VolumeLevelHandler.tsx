
import { useEffect } from "react";
import { getRecommendedExercises } from "@/utils/exerciseRecommendations";
import type { Exercise } from "@/types/workout";

type VolumeLevelProps = {
  volumeLevel: "minimum" | "moderate" | "maximum";
  selectedExercises: string[];
  exercises: Exercise[];
  muscleGroups: string[];
  onExerciseToggle: (exerciseId: string) => void;
};

const VolumeLevelHandler = ({
  volumeLevel,
  selectedExercises,
  exercises,
  muscleGroups,
  onExerciseToggle,
}: VolumeLevelProps) => {
  useEffect(() => {
    if (volumeLevel === "minimum" && selectedExercises.length === 0) {
      const recommendedIds: string[] = [];
      
      muscleGroups.forEach(group => {
        const recommended = getRecommendedExercises(group, "minimum");
        if (recommended.length > 0) {
          const validExercises = exercises.filter(
            ex => ex.muscleGroup === group && recommended.some(r => 
              ex.id.includes(r) || ex.name.toLowerCase().includes(r)
            )
          );
          
          validExercises.forEach(ex => {
            if (!recommendedIds.includes(ex.id)) {
              recommendedIds.push(ex.id);
            }
          });
        }
      });
      
      if (recommendedIds.length > 0) {
        recommendedIds.forEach(id => {
          if (!selectedExercises.includes(id)) {
            onExerciseToggle(id);
          }
        });
      }
    }
  }, [exercises, muscleGroups, volumeLevel, selectedExercises.length]);

  return null;
};

export default VolumeLevelHandler;
