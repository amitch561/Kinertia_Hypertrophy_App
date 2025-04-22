
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp } from "lucide-react";
import VolumeHeader from "./VolumeHeader";
import VolumeStatusItem from "./VolumeStatusItem";
import StatusMessages from "./StatusMessages";
import { useVolumeStatus } from "@/hooks/useVolumeStatus";

interface VolumeStatusAlertProps {
  volumeStatus: {
    muscleGroup: string;
    current: number;
    min: number;
    moderate: number;
    max: number;
    isLow: boolean;
    isHigh: boolean;
  }[];
  muscleGroups: string[];
  focusMuscleGroups?: string[];
  experience?: string;
  volumeLevel?: "minimum" | "moderate" | "maximum";
}

const VolumeStatusAlert: React.FC<VolumeStatusAlertProps> = ({
  volumeStatus,
  muscleGroups,
  focusMuscleGroups = [],
  experience = 'beginner',
  volumeLevel = 'moderate'
}) => {
  const relevantStatus = volumeStatus.filter(status => 
    muscleGroups.includes(status.muscleGroup)
  );
  
  const {
    volumeStatusData,
    hasLowVolume,
    hasHighVolumeNoFocus,
    hasExceededMRV
  } = useVolumeStatus(relevantStatus, focusMuscleGroups, volumeLevel);
  
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
