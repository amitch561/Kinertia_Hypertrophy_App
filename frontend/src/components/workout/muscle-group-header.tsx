
import React from "react";
import { VolumeStatus } from "@/types/workout";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";

interface MuscleGroupHeaderProps {
  muscleGroup: string;
  volumeStatus?: VolumeStatus;
}

const MuscleGroupHeader = ({ muscleGroup, volumeStatus }: MuscleGroupHeaderProps) => {
  const showInfo =
    muscleGroup.trim().toLowerCase() === "shoulders";
  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <h3 className="text-base font-medium capitalize flex items-center">
          {muscleGroup}
          {showInfo && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-2 cursor-help">
                    <Info className="h-4 w-4 text-gray-400 inline-block" aria-label="Shoulder subgroup info" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-[#23252A] text-white border-[#404040]">
                  Front delts are typically activated during most pressing exercises and therefore often receive adequate stimulation without direct isolation.
                  <br />
                  <span className="block mt-2 text-xs text-gray-300">
                    Select Shoulders as a focus group to isolate and emphasize all deltoid heads including front delts.
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
        {volumeStatus && (
          <span
            className={`ml-2 text-xs ${
              volumeStatus.isLow
                ? "text-yellow-400"
                : volumeStatus.isHigh
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {volumeStatus.current}/{volumeStatus.max} sets
          </span>
        )}
      </div>
    </div>
  );
};

export default MuscleGroupHeader;

