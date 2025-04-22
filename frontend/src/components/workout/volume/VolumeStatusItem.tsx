
import React from "react";
import type { VolumeStatus } from "@/types/workout";

interface VolumeStatusItemProps extends VolumeStatus {
  targetVolume: number;
  isFocused: boolean;
  statusColor: string;
  progressColor: string;
}

const VolumeStatusItem: React.FC<VolumeStatusItemProps> = ({
  muscleGroup,
  current,
  min,
  moderate,
  max,
  targetVolume,
  isFocused,
  statusColor,
  progressColor,
  isLow,
  isHigh
}) => {
  // Calculate percentage based on max value rather than target for a more accurate visualization
  const percentComplete = Math.min(100, (current / max) * 100);
  
  // Format the muscle group name for display
  const formatMuscleGroup = (group: string) => {
    return group.charAt(0).toUpperCase() + group.slice(1);
  };

  const exceedsMRV = current > max;
  const exceedsTarget = current > targetVolume;
  const isExactlyOnTarget = current === targetVolume;

  // Label for selected volume type
  const getVolumeTypeLabel = () => {
    if (targetVolume === min) return "MEV";
    if (targetVolume === max) return "MRV";
    return "Moderate";
  };

  return (
    <div className="space-y-1" data-testid={`volume-status-${muscleGroup}`}>
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <span className="font-medium capitalize">
            {formatMuscleGroup(muscleGroup)}
          </span>
          {isFocused && (
            <span className="text-primary text-xs">(focus)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`${statusColor} font-medium`}>
            {current}/{targetVolume} <span className="text-xs">{getVolumeTypeLabel()}</span>
            {(exceedsMRV || (exceedsTarget && !isFocused)) && 
              <span className="ml-1 text-yellow-500">⚠️</span>}
          </span>
          <span className="text-gray-500 text-xs">
            (optimal: {moderate})
          </span>
        </div>
      </div>
      <div className="w-full h-2 bg-neutral rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300`}
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-0.5">
        <span>MEV: {min}</span>
        <span>{targetVolume === moderate ? "Target" : "Optimal"}: {moderate}</span>
        <span>MRV: {max}</span>
      </div>
      {/* Visual target marker on the progress bar */}
      <div className="relative h-0">
        <div 
          className="absolute w-0.5 h-3 bg-white -mt-3"
          style={{ left: `${(targetVolume / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VolumeStatusItem;
