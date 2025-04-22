
import React from "react";
import type { Exercise, SubGroup, MuscleGroup } from "@/types/workout";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";
import SelectedExercisesList from "./SelectedExercisesList";
import AddRow from "./add-row";

interface SubGroupExerciseListProps {
  group: MuscleGroup;
  subGroup: SubGroup;
  selectedExercises: string[];
  getExerciseById: (id: string) => Exercise | undefined;
  openExerciseSelector: (groupId: string, subGroup: SubGroup) => void;
}

const SubGroupExerciseList: React.FC<SubGroupExerciseListProps> = ({
  group,
  subGroup,
  selectedExercises,
  getExerciseById,
  openExerciseSelector,
}) => {
  return (
    <div className="rounded-lg bg-[#262b36] p-3 mb-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-slate-100">{subGroup.name}</span>
      </div>
      <SelectedExercisesList
        group={group}
        subGroup={subGroup}
        selectedExercises={selectedExercises}
        getExerciseById={getExerciseById}
      />
      <AddRow
        label={`Add ${
          selectedExercises.filter(exId => {
            const ex = getExerciseById(exId);
            return (
              ex && ex.muscleGroup === group.id &&
              (getSubGroupId(ex) === subGroup.id ||
                (group.id === "chest" && subGroup.id === "upper_chest" && getSubGroupId(ex) === "upper") ||
                (group.id === "chest" && subGroup.id === "mid_chest" && getSubGroupId(ex) === "mid") ||
                (group.id === "chest" && subGroup.id === "lower_chest" && getSubGroupId(ex) === "lower"))
            );
          }).length > 0 ? 'another' : 'an'
        } exercise`}
        onClick={() => openExerciseSelector(group.id, subGroup)}
      />
    </div>
  );
};

export default SubGroupExerciseList;
