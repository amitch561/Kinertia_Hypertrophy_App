
import React from "react";
import type { SubGroup, MuscleGroup, Exercise } from "@/types/workout";
import SubGroupExerciseList from "./SubGroupExerciseList";

interface SubGroupListProps {
  group: MuscleGroup;
  selectedExercises: string[];
  getExerciseById: (id: string) => Exercise | undefined;
  openExerciseSelector: (groupId: string, subGroup: SubGroup) => void;
}

const SubGroupList: React.FC<SubGroupListProps> = ({
  group,
  selectedExercises,
  getExerciseById,
  openExerciseSelector
}) => {
  return (
    <>
      {group.subGroups.map(subGroup => (
        <SubGroupExerciseList
          key={subGroup.id}
          group={group}
          subGroup={subGroup}
          selectedExercises={selectedExercises}
          getExerciseById={getExerciseById}
          openExerciseSelector={openExerciseSelector}
        />
      ))}
    </>
  );
};

export default SubGroupList;
