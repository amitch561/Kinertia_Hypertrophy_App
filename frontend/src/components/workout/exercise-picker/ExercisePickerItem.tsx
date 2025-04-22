
import React from 'react';
import { Exercise } from "@/types/workout";
import ExercisePickerExerciseCard from "../ExercisePickerExerciseCard";
import type { ProcessedExercise } from "./exerciseProcessingUtils";

interface ExercisePickerItemProps {
  processedExercise: ProcessedExercise;
  isSelected: boolean;
  onSelect: (exerciseId: string) => void;
  volumeInfo?: any;
}

const ExercisePickerItem: React.FC<ExercisePickerItemProps> = ({
  processedExercise,
  isSelected,
  onSelect,
  volumeInfo
}) => {
  const { exercise, isRecommended, recommendationNote } = processedExercise;
  
  return (
    <ExercisePickerExerciseCard
      key={exercise.id}
      exercise={exercise}
      isSelected={isSelected}
      onSelect={() => onSelect(exercise.id)}
      volumeInfo={volumeInfo}
      isRecommended={isRecommended}
      recommendationNote={recommendationNote}
    />
  );
};

export default ExercisePickerItem;
