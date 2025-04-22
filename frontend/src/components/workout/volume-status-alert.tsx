
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp } from "lucide-react";
import VolumeHeader from "./volume/VolumeHeader";
import VolumeStatusItem from "./volume/VolumeStatusItem";
import StatusMessages from "./volume/StatusMessages";
import { useVolumeStatus } from "@/hooks/useVolumeStatus";

interface VolumeStatusProps {
  volumeStatus: {
    muscleGroup: string;
    current: number;
    min: number;
    moderate: number;
    max: number;
    isLow: boolean;
    isHigh: boolean;
    isExceedingMEV?: boolean;
  }[];
  muscleGroups: string[];
  focusMuscleGroups?: string[];
  experience?: string;
  volumeLevel?: "minimum" | "moderate" | "maximum";
}

const VolumeStatusAlert: React.FC<VolumeStatusProps> = ({
  volumeStatus,
  muscleGroups,
  focusMuscleGroups = [],
  experience = 'beginner',
  volumeLevel = 'moderate'
}) => {
  // Filter volume status to only include muscle groups that are in the current split
  const relevantStatus = volumeStatus.filter(status => 
    muscleGroups.includes(status.muscleGroup)
  );
  
  // Use the hook to process the volume status data
  const {
    volumeStatusData,
    hasLowVolume,
    hasHighVolumeNoFocus,
    hasExceededMRV
  } = useVolumeStatus(relevantStatus, focusMuscleGroups, volumeLevel);
  
  // If no relevant volume status data, don't render anything
  if (volumeStatusData.length === 0) {
    return null;
  }

  return (
    <Alert className="bg-[#2A2A2A] border-[#3F3F3F]">
      <TrendingUp className="h-4 w-4 text-primary" />
      <AlertDescription className="text-sm">
        <VolumeHeader 
          volumeLevel={volumeLevel}
          focusMuscleGroups={focusMuscleGroups}
        />
        
        <div className="space-y-3">
          {volumeStatusData.map(status => (
            <VolumeStatusItem
              key={status.muscleGroup}
              {...status}
              isLow={relevantStatus.find(s => s.muscleGroup === status.muscleGroup)?.isLow || false}
              isHigh={relevantStatus.find(s => s.muscleGroup === status.muscleGroup)?.isHigh || false}
            />
          ))}
        </div>
        
        <StatusMessages
          hasLowVolume={hasLowVolume}
          hasHighVolumeNoFocus={hasHighVolumeNoFocus}
          hasExceededMRV={hasExceededMRV}
          volumeLevel={volumeLevel}
          focusMuscleGroups={focusMuscleGroups}
          experience={experience}
        />
      </AlertDescription>
    </Alert>
  );
};

export default VolumeStatusAlert;
