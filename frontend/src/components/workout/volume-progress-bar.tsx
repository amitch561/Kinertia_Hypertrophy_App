
import React from "react";
import { Progress } from "@/components/ui/progress";
import { VolumeStatus } from "@/types/workout";

interface VolumeProgressBarProps {
  volumeStatus: VolumeStatus;
}

const VolumeProgressBar = ({ volumeStatus }: VolumeProgressBarProps) => {
  const getProgressColor = (isLow: boolean, isHigh: boolean) => {
    if (isLow) return "bg-yellow-500";
    if (isHigh) return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <div className="mb-3">
      <Progress 
        value={(volumeStatus.current / volumeStatus.max) * 100}
        className={`h-1.5 ${getProgressColor(volumeStatus.isLow, volumeStatus.isHigh)}`}
      />
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>{volumeStatus.min}</span>
        <span>Target: {volumeStatus.moderate} sets/week</span>
        <span>{volumeStatus.max}</span>
      </div>
    </div>
  );
};

export default VolumeProgressBar;
