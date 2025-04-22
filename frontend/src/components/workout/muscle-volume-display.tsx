
import React from "react";
import { VolumeStatus } from "@/types/workout";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";

interface MuscleVolumeDisplayProps {
  muscleGroup: string;
  volumeStatus?: VolumeStatus;
  isFocused: boolean;
  volumeLevel?: "minimum" | "moderate" | "maximum";
}

const MuscleVolumeDisplay: React.FC<MuscleVolumeDisplayProps> = ({
  muscleGroup,
  volumeStatus,
  isFocused,
  volumeLevel = "moderate",
}) => {
  const getTargetVolume = () => {
    if (!volumeStatus) return 0;
    
    switch (volumeLevel) {
      case "minimum":
        return volumeStatus.min;
      case "maximum":
        return volumeStatus.max;
      case "moderate":
      default:
        return volumeStatus.moderate;
    }
  };

  const getVolumeStatusColor = () => {
    if (!volumeStatus) return "text-gray-400";
    
    const target = getTargetVolume();
    
    if (volumeStatus.current < target) {
      return "text-yellow-400"; // Below target - yellow
    }
    
    if (volumeStatus.current === target) {
      return "text-green-400"; // Exactly at target - green
    }
    
    // Current > target
    if (volumeStatus.current > target) {
      // If exceeding MRV, always show red
      if (volumeStatus.current >= volumeStatus.max) {
        return "text-red-400";
      }
      
      // If exceeding target but below MRV
      return isFocused ? "text-green-400" : "text-orange-400";
    }
    
    return "text-green-400"; // Default
  };

  return (
    <div className="flex items-center justify-between">
      <h5 className="text-md font-medium flex items-center gap-1">
        {muscleGroup}{" "}
        {isFocused && (
          <Badge variant="secondary" className="bg-[#E65A00] text-white">Focus</Badge>
        )}
      </h5>
      {volumeStatus && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`text-xs cursor-help ${getVolumeStatusColor()}`}>
              {volumeStatus.current}/{getTargetVolume()} Sets
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[#2A2A2A] text-white border-[#454545]">
            <p>
              Current volume: {volumeStatus.current} sets. Target:{" "}
              {getTargetVolume()} sets.
              
              {volumeLevel === "minimum" && volumeStatus.current > volumeStatus.min && !isFocused && (
                <span className="block mt-1 text-orange-400">
                  Volume exceeds MEV without focus. Either add as focus muscle or reduce volume.
                </span>
              )}
              
              {volumeStatus.current > getTargetVolume() && volumeStatus.current < volumeStatus.max && !isFocused && volumeLevel !== "minimum" && (
                <span className="block mt-1 text-orange-400">
                  Volume exceeds target without focus. Consider adding as a focus muscle group.
                </span>
              )}
              
              {volumeStatus.current >= volumeStatus.max && (
                <span className="block mt-1 text-red-400">
                  Volume exceeds MRV (Maximum Recoverable Volume). Consider reducing volume.
                </span>
              )}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default MuscleVolumeDisplay;
