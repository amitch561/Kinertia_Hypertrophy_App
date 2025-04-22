
// Fix Add Working Set button functionality and initialization of reps to avoid repeated update

import React from "react";
import { Set } from "@/types/workout";
import { WorkingSetRow } from "./working-set-row";
import { Button } from "@/components/ui/button-component";
import { Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";
import { calculateTargetReps } from "@/utils/repCalculation";

interface WorkingSetsProps {
  sets: Set[];
  exerciseIndex: number;
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  weightUnit: 'kg' | 'lbs';
  onAddSet: (exerciseIndex: number) => void;
}

export const WorkingSets: React.FC<WorkingSetsProps> = ({
  sets,
  exerciseIndex,
  updateExerciseSet,
  weightUnit,
  onAddSet,
}) => {
  React.useEffect(() => {
    // Set default reps only if currently zero for any set
    sets.forEach((set, idx) => {
      if (set.reps === 0) {
        const targetReps = calculateTargetReps();
        updateExerciseSet(exerciseIndex, idx, { reps: targetReps });
      }
    });
    // Depend on sets length only to avoid repeated updates
  }, [sets.length, exerciseIndex, updateExerciseSet]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-medium text-white">Working Sets</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] bg-neutral text-white border-neutral-light rounded-lg">
              <p>Default reps are set 3 reps shy of your failure point (RFF = 3). Adjust as needed.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2 text-sm text-gray-400">
        <div>Set</div>
        <div>Weight ({weightUnit})</div>
        <div>
          <div className="flex items-center gap-1">
            Reps
          </div>
        </div>
        <div className="text-right">Done</div>
      </div>

      {sets.map((set, idx) => (
        <WorkingSetRow 
          key={set.id}
          set={set}
          exerciseIndex={exerciseIndex}
          setIndex={idx}
          updateExerciseSet={updateExerciseSet}
          weightUnit={weightUnit}
        />
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddSet(exerciseIndex)}
        className="w-full mt-2 border border-dashed border-gray-600 hover:border-gray-500 hover:bg-neutral/50 rounded-lg"
        aria-label="Add Working Set"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Working Set
      </Button>
    </div>
  );
};
