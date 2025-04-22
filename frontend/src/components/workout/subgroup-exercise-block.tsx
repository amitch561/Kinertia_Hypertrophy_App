
import React from "react";
import { Plus, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubGroupExerciseSelector from "./subgroup-exercise-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";
import { Exercise } from "@/types/workout";

interface SubGroupExerciseBlockProps {
  subGroup: { id?: string; name: string; exercises?: Exercise[] };
  selectedExercise?: Exercise;
  isFocus: boolean;
  muscleGroup: string;
  isReadOnly: boolean;
  isLast: boolean;
  onExerciseChange: (value: string | null) => void;
  onOpenExercisePicker?: (muscleGroup: string, subGroupName: string) => void;
  isPushDaySequence: number;
  isSecondary?: boolean;
  skipSubGroups?: Record<string, string[]>;
}

const SubGroupExerciseBlock: React.FC<SubGroupExerciseBlockProps> = ({
  subGroup,
  selectedExercise,
  isFocus,
  muscleGroup,
  isReadOnly,
  isLast,
  onExerciseChange,
  onOpenExercisePicker,
  isPushDaySequence,
  isSecondary = false,
  skipSubGroups = {}
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("📦 SubGroupExerciseBlock rendering:", {
      muscleGroup,
      subGroupName: subGroup.name,
      exercises: subGroup.exercises?.length,
      isSkipped: skipSubGroups[muscleGroup]?.includes(subGroup.name) || subGroup.name.toLowerCase().includes("general"),
      selectedExercise: selectedExercise?.name || "None"
    });
  }

  if (!subGroup?.name || subGroup.name.toLowerCase().includes("general")) {
    return null;
  }

  if (skipSubGroups[muscleGroup]?.includes(subGroup.name)) {
    return null;
  }

  const isFrontDelt = subGroup.name.includes('Front Delt') && muscleGroup === 'Shoulders';
  const isRearDelt = subGroup.name.includes('Rear Delt') && muscleGroup === 'Shoulders';

  const getSecondaryInfoMessage = () => {
    if (isFrontDelt) {
      return "Front delts are typically trained indirectly during chest pressing movements. Direct work is often only needed if they're a specific weak point.";
    }
    if (isRearDelt) {
      return "Rear delts are important for balanced shoulder development and posture. They're often undertrained in typical routines.";
    }
    if (isSecondary) {
      return "This muscle group is often trained indirectly during other compound movements.";
    }
    return "";
  };

  const secondaryInfo = getSecondaryInfoMessage();

  return (
    <div 
      className={`relative rounded-lg p-2 mb-2 ${isFocus ? "bg-[#D3E4FD] border-2 border-[#9b87f5]" : "bg-[#2A2E3B]"} transition-colors`}
    >
      <div className="flex items-center px-1 py-1">
        <SubGroupExerciseSelector
          subGroupName={subGroup.name}
          exercises={subGroup.exercises || []}
          selectedExercise={selectedExercise}
          onExerciseChange={onExerciseChange}
          isReadOnly={isReadOnly}
          isFocus={isFocus}
          isSecondary={isSecondary || isFrontDelt || isRearDelt}
          secondaryInfo={secondaryInfo}
        />
        {isFocus && (
          <span className="ml-2 flex items-center whitespace-nowrap px-2 py-0.5 rounded-full bg-[#9b87f5] text-xs text-[#231849] font-bold">
            <Star className="w-3 h-3 mr-1" /> Focus
          </span>
        )}
      </div>

      {!isReadOnly && onOpenExercisePicker && (
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full mt-2 border border-dashed border-gray-600 hover:bg-[#D3E4FD]/30"
          onClick={() => onOpenExercisePicker(muscleGroup, subGroup.name)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {`Add ${(subGroup.exercises || []).length ? 'another' : 'an'} exercise for ${subGroup.name}`}
        </Button>
      )}
    </div>
  );
};

export default SubGroupExerciseBlock;
