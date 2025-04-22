
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { History, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { undertrainedSubGroups } from "@/lib/workout/exercises/secondaryMuscleMap";
import { useWorkout } from "@/contexts/WorkoutContext";

interface UndertrainedSubgroupAlertProps {
  weeksBelowMEVThreshold?: number;
}

const UndertrainedSubgroupAlert: React.FC<UndertrainedSubgroupAlertProps> = ({
  weeksBelowMEVThreshold = 3
}) => {
  const { subgroupHistory } = useWorkout();
  
  // Get subgroups that have been undertrained for specified weeks
  const prioritySubgroups = Object.entries(subgroupHistory)
    .filter(([_, data]) => data.weeksUnderMEV >= weeksBelowMEVThreshold)
    .sort(([idA, _], [idB, __]) => {
      // Sort by priority from the undertrainedSubGroups table
      const priorityA = undertrainedSubGroups[idA]?.priority || 0;
      const priorityB = undertrainedSubGroups[idB]?.priority || 0;
      return priorityB - priorityA; // Higher priority first
    })
    .map(([id, data]) => ({
      id,
      weeksUnderMEV: data.weeksUnderMEV,
      ...undertrainedSubGroups[id]
    }))
    .filter(item => item.name); // Filter out any undefined subgroups
  
  if (prioritySubgroups.length === 0) {
    return null;
  }

  return (
    <Alert className="bg-amber-900/20 border-amber-500/30 mb-4">
      <History className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="font-medium text-amber-200">Undertrained Muscle Areas Detected</h3>
        </div>
        
        <p className="text-sm text-amber-100/80 mb-2">
          These muscle areas have received below MEV (Minimum Effective Volume) for {weeksBelowMEVThreshold}+ weeks and will be prioritized:
        </p>
        
        <div className="space-y-2">
          {prioritySubgroups.map(subgroup => (
            <div key={subgroup.id} className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-200">
                {subgroup.name}
              </Badge>
              <span className="text-xs text-amber-100/70">
                {subgroup.weeksUnderMEV} weeks below MEV • {subgroup.description}
              </span>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-amber-100/60 mt-3">
          <strong>Based on research:</strong> {prioritySubgroups[0]?.evidenceSource || "EMG studies and training program analysis"}
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default UndertrainedSubgroupAlert;
