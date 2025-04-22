
import React from "react";
import { TrendingUp, Target } from "lucide-react";

interface VolumeHeaderProps {
  volumeLevel: "minimum" | "moderate" | "maximum";
  focusMuscleGroups: string[];
}

const VolumeHeader: React.FC<VolumeHeaderProps> = ({ volumeLevel, focusMuscleGroups }) => {
  const getTargetLabel = () => {
    switch (volumeLevel) {
      case 'minimum':
        return 'MEV (Minimum Effective Volume)';
      case 'moderate':
        return 'Target Volume';
      case 'maximum':
        return 'MRV (Maximum Recoverable Volume)';
      default:
        return 'Target Volume';
    }
  };

  const formatMuscleGroup = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="mb-2">
      <span className="font-medium">Weekly Volume Status</span>
      <span className="text-xs ml-2 text-gray-400">
        ({getTargetLabel()})
      </span>
      {focusMuscleGroups.length > 0 && (
        <span className="text-xs ml-2 text-primary">
          (Focusing on {focusMuscleGroups.map(m => formatMuscleGroup(m)).join(', ')})
        </span>
      )}
    </div>
  );
};

export default VolumeHeader;
