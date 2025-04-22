
import React from "react";
import { MuscleGroup, Exercise } from "@/types/workout";
import SubGroupList from "./SubGroupList";
import MuscleGroupHeader from "./MuscleGroupHeader";
import RecoveryFeedbackSection from "./RecoveryFeedbackSection";
import type { RecoveryFeedback } from "@/hooks/progressive-overload/types";
import VolumeStatusItem from "./volume/VolumeStatusItem";
import { useVolumeStatus } from "@/hooks/useVolumeStatus";

interface MuscleGroupSectionProps {
  group: MuscleGroup;
  selectedExercises: string[];
  onSetFocusGroup: (groupId: string) => void;
  getExerciseById: (id: string) => Exercise | undefined;
  openExerciseSelector: (muscleGroup: string, subGroup: { name: string; exercises: Exercise[] }) => void;
  recoveryFeedback?: RecoveryFeedback;
  showRecoveryInputs?: boolean;
  onRecoveryChange?: (muscleGroup: string, metric: 'rir' | 'pump' | 'soreness' | 'fatigue', value: number) => void;
  skipSubGroups?: string[];
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  volumeLevel?: 'minimum' | 'moderate' | 'maximum';
  volumeStatus?: { 
    muscleGroup: string; 
    current: number; 
    min: number; 
    moderate: number; 
    max: number; 
    isLow: boolean; 
    isHigh: boolean;
  };
}

const MuscleGroupSection = ({
  group,
  selectedExercises,
  onSetFocusGroup,
  getExerciseById,
  openExerciseSelector,
  recoveryFeedback,
  showRecoveryInputs = false,
  onRecoveryChange,
  skipSubGroups = [],
  volumeStatus
}: MuscleGroupSectionProps) => {
  const visibleSubGroups = group.subGroups.filter(
    subGroup => !skipSubGroups.includes(subGroup.id)
  );

  // Format the volume status for display
  const volumeStatusData = volumeStatus ? 
    useVolumeStatus(
      [volumeStatus], 
      group.isFocus ? [group.id] : [], 
      volumeStatus.current <= volumeStatus.min ? 'minimum' : 
      volumeStatus.current >= volumeStatus.max ? 'maximum' : 'moderate'
    ).volumeStatusData[0] : null;

  if (visibleSubGroups.length === 0) {
    return (
      <div className="mb-4 rounded-lg p-4 bg-[#23292F] border border-[#434345]">
        <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
        <div className="p-3 bg-[#2A2E3B] rounded-md text-gray-400 text-sm">
          All secondary fibers already covered today by other exercises.
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mb-4 rounded-lg p-4 transition-all duration-300 ease-in-out ${
        group.isFocus 
          ? "bg-[#2A2E3B] border-2 border-[#9b87f5] shadow-lg" 
          : "bg-[#23292F] border border-[#434345]"
      }`}
    >
      <MuscleGroupHeader 
        name={group.name}
        isFocus={group.isFocus}
        onSetFocus={() => onSetFocusGroup(group.id)}
      />
      
      {volumeStatusData && (
        <div className="mt-2 mb-3">
          <VolumeStatusItem 
            muscleGroup={volumeStatusData.muscleGroup}
            current={volumeStatusData.current}
            min={volumeStatusData.min}
            moderate={volumeStatusData.moderate}
            max={volumeStatusData.max}
            targetVolume={volumeStatusData.targetVolume}
            isFocused={volumeStatusData.isFocused}
            statusColor={volumeStatusData.statusColor}
            progressColor={volumeStatusData.progressColor}
            isLow={volumeStatusData.isLow}
            isHigh={volumeStatusData.isHigh}
          />
        </div>
      )}

      <div className="space-y-4">
        <SubGroupList
          group={group}
          selectedExercises={selectedExercises}
          getExerciseById={getExerciseById}
          openExerciseSelector={openExerciseSelector}
        />
      </div>

      {showRecoveryInputs && (
        <RecoveryFeedbackSection
          recoveryFeedback={recoveryFeedback}
          onRecoveryChange={onRecoveryChange}
          muscleGroup={group.id}
        />
      )}
    </div>
  );
};

export default MuscleGroupSection;
