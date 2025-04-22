
import React from "react";
import { MuscleGroup, SubGroup, Exercise } from "@/types/workout";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";
import ExerciseListItem from "./ExerciseListItem";

interface SelectedExercisesListProps {
  group: MuscleGroup;
  subGroup: SubGroup;
  selectedExercises: string[];
  getExerciseById: (id: string) => Exercise | undefined;
}

const SelectedExercisesList: React.FC<SelectedExercisesListProps> = ({
  group,
  subGroup,
  selectedExercises,
  getExerciseById
}) => {
  const exercisesThisSubGroup = selectedExercises
    .map(getExerciseById)
    .filter(
      ex =>
        ex &&
        ex.muscleGroup === group.id &&
        (
          getSubGroupId(ex) === subGroup.id ||
          (group.id === "chest" && subGroup.id === "upper_chest" && getSubGroupId(ex) === "upper") ||
          (group.id === "chest" && subGroup.id === "mid_chest" && getSubGroupId(ex) === "mid") ||
          (group.id === "chest" && subGroup.id === "lower_chest" && getSubGroupId(ex) === "lower")
        )
    );

  if (exercisesThisSubGroup.length === 0) return null;

  return (
    <div className="space-y-2">
      {exercisesThisSubGroup.map(ex => ex && (
        <ExerciseListItem key={ex.id} exercise={ex} />
      ))}
    </div>
  );
};

export default SelectedExercisesList;
