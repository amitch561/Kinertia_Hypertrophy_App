
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card-container";
import { VolumeStatus } from "@/types/workout";
import { useWorkout } from "@/contexts/WorkoutContext";

interface WeeklyVolumeTrackerProps {
  volumeStatus?: VolumeStatus[]; // Make prop optional
  volumeLevel?: "minimum" | "moderate" | "maximum";
  focusMuscleGroups?: string[];
}

const WeeklyVolumeTracker: React.FC<WeeklyVolumeTrackerProps> = ({ 
  volumeStatus: propVolumeStatus,
  volumeLevel = "moderate",
  focusMuscleGroups = []
}) => {
  const { volumeStatus: contextVolumeStatus } = useWorkout();
  
  // Use the prop if provided, otherwise use the context value
  const volumeStatus = propVolumeStatus || contextVolumeStatus;
  
  const getProgressColor = (muscleGroup: string, current: number, target: number, max: number) => {
    const isFocused = focusMuscleGroups.includes(muscleGroup);
    const isExactlyOnTarget = current === target;
    
    // Color logic matching VolumeStatusItem
    if (isExactlyOnTarget) return "bg-green-500"; // Exact target = green
    if (current < target) {
      if (current < target * 0.5) return "bg-red-500"; // Significantly below target
      return "bg-blue-500"; // Below target but reasonable
    }
    if (current > max) return "bg-red-500"; // Exceeding MRV
    if (current > target) {
      return isFocused ? "bg-blue-500" : "bg-yellow-500"; // Over target but under MRV
    }
    return "bg-blue-500"; // Default - within range
  };

  // Get target volume based on volume level
  const getTargetVolume = (status: VolumeStatus) => {
    switch (volumeLevel) {
      case "minimum":
        return status.min;
      case "maximum":
        return status.max;
      case "moderate":
      default:
        return status.moderate;
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {volumeStatus.map((status) => {
            const targetVolume = getTargetVolume(status);
            const isFocused = focusMuscleGroups.includes(status.muscleGroup);
            const exceededTarget = status.current > targetVolume;
            const exceedsMRV = status.current > status.max;
            const isExactlyOnTarget = status.current === targetVolume;
            
            // For minimum volume level, highlight when exceeding MEV without focus
            const showExceedingMEVWarning = volumeLevel === "minimum" && 
                                          exceededTarget && 
                                          !isFocused;
            
            return (
              <div key={status.muscleGroup} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="capitalize flex items-center gap-1">
                    {status.muscleGroup}
                    {isFocused && (
                      <span className="text-xs text-primary">(Focus)</span>
                    )}
                    {showExceedingMEVWarning && (
                      <span className="text-xs text-orange-400">(Exceeds MEV)</span>
                    )}
                  </span>
                  <span className={`${
                    status.current < targetVolume ? 'text-yellow-500' : 
                    isExactlyOnTarget ? 'text-green-500' :
                    exceedsMRV ? (isFocused ? 'text-orange-500' : 'text-red-500') :
                    exceededTarget ? (isFocused ? 'text-green-500' : 'text-yellow-500') : 
                    'text-green-500'
                  }`}>
                    {status.current} / {targetVolume} sets
                    {(exceedsMRV || (exceededTarget && !isFocused)) && 
                      <span className="ml-1 text-yellow-500">⚠️</span>}
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min((status.current / status.max) * 100, 100)}
                    className={`h-2 ${getProgressColor(status.muscleGroup, status.current, targetVolume, status.max)}`}
                  />
                  {/* Visual target marker */}
                  <div 
                    className="absolute top-0 left-1/2 h-4 w-0.5 bg-white -translate-y-1"
                    style={{ 
                      left: `${(targetVolume / status.max) * 100}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>MEV: {status.min}</span>
                  <span>Target: {targetVolume}</span>
                  <span>MRV: {status.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyVolumeTracker;
