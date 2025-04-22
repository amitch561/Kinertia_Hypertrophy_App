
import { useState } from "react";
import ExercisePickerModal from "@/components/workout/ExercisePickerModal";
import type { SubGroup } from "@/types/workout";

type ExerciseModalHandlerProps = {
  selectedExercises: string[];
  onSelectExercise: (exerciseId: string) => void;
  focusMuscleGroups?: string[];
};

const ExerciseModalHandler = ({
  selectedExercises,
  onSelectExercise,
  focusMuscleGroups = [],
}: ExerciseModalHandlerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [modalGroup, setModalGroup] = useState<{
    groupId: string;
    subGroup: SubGroup | null;
  }>({
    groupId: "",
    subGroup: null,
  });

  const handleOpenExercisePicker = (muscleGroup: string, subGroupName: string) => {
    const subGroup = subGroupName
      ? {
          id: subGroupName.toLowerCase().replace(/\s+/g, "_"),
          name: subGroupName,
          exercises: [],
        }
      : null;

    setModalGroup({
      groupId: muscleGroup,
      subGroup,
    });
    setShowModal(true);
  };

  const handleSelectExercise = (exerciseId: string) => {
    onSelectExercise(exerciseId);
    setShowModal(false);
  };

  return (
    <ExercisePickerModal
      open={showModal}
      onClose={() => setShowModal(false)}
      groupId={modalGroup.groupId}
      subGroup={modalGroup.subGroup}
      onSelectExercise={handleSelectExercise}
      selectedExercises={selectedExercises}
      focusMuscleGroups={focusMuscleGroups}
    />
  );
};

export default ExerciseModalHandler;
