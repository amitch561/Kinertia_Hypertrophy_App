
import React from "react";
import MuscleGroupSection from "./MuscleGroupSection";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";
import type { Exercise, MuscleGroup, SubGroup } from "@/types/workout";
import type { RecoveryFeedback as RecoveryFeedbackType } from "@/hooks/progressive-overload/types";

interface VolumeStatus {
  muscleGroup: string;
  current: number;
  min: number;
  moderate: number;
  max: number;
  isLow: boolean;
  isHigh: boolean;
}

interface MuscleGroupSectionWrapperProps {
  muscleGroup: string;
  exercises: Exercise[];
  selectedExercises: string[];
  focusMuscleGroups?: string[];
  isPushDaySequence: number;
  isReadOnly: boolean;
  volumeStatus?: VolumeStatus;
  recoveryFeedback?: RecoveryFeedbackType[];
  showRecoveryInputs?: boolean;
  onExerciseToggle: (exerciseId: string, isPushDay?: number) => void;
  onOpenExercisePicker?: (muscleGroup: string, subGroupName: string) => void;
  onRecoveryChange?: (muscleGroup: string, metric: 'rir' | 'pump' | 'soreness' | 'fatigue', value: number) => void;
  manualShoulderTargeting?: boolean;
}

const MuscleGroupSectionWrapper = ({
  muscleGroup,
  exercises,
  selectedExercises,
  focusMuscleGroups = [],
  isPushDaySequence,
  isReadOnly,
  volumeStatus,
  recoveryFeedback = [],
  showRecoveryInputs = false,
  onExerciseToggle,
  onOpenExercisePicker,
  onRecoveryChange,
  manualShoulderTargeting,
}: MuscleGroupSectionWrapperProps) => {
  const muscleGroupData: MuscleGroup = {
    id: muscleGroup,
    name: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1),
    isFocus: focusMuscleGroups.includes(muscleGroup),
    subGroups: [],
  };

  const subGroupMap = new Map<string, SubGroup>();
  
  exercises.filter(ex => ex.muscleGroup === muscleGroup).forEach(exercise => {
    const subGroupId = getSubGroupId(exercise);
    if (!subGroupMap.has(subGroupId)) {
      subGroupMap.set(subGroupId, {
        id: subGroupId,
        name: subGroupId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        exercises: []
      });
    }
    subGroupMap.get(subGroupId)?.exercises.push(exercise);
  });
  
  muscleGroupData.subGroups = Array.from(subGroupMap.values());

  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find(ex => ex.id === id);
  };

  const openExerciseSelector = (groupId: string, subGroup: SubGroup) => {
    if (onOpenExercisePicker) {
      onOpenExercisePicker(groupId, subGroup.name);
    }
  };

  const currentRecoveryFeedback = recoveryFeedback.find(feedback => feedback.muscleGroup === muscleGroup);
  
  // Find the volume status for this muscle group
  const currentVolumeStatus = volumeStatus;

  return (
    <MuscleGroupSection
      key={muscleGroup}
      group={muscleGroupData}
      selectedExercises={selectedExercises}
      onSetFocusGroup={() => {/* Handle focus change if needed */}}
      getExerciseById={getExerciseById}
      openExerciseSelector={openExerciseSelector}
      recoveryFeedback={currentRecoveryFeedback}
      onRecoveryChange={onRecoveryChange}
      showRecoveryInputs={showRecoveryInputs}
      volumeStatus={currentVolumeStatus}
    />
  );
};

export default MuscleGroupSectionWrapper;
