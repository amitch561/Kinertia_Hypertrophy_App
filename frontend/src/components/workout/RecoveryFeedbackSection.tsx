
import React from "react";
import type { RecoveryFeedback } from "@/hooks/progressive-overload/types";

interface RecoveryFeedbackSectionProps {
  recoveryFeedback?: RecoveryFeedback;
  onRecoveryChange?: (muscleGroup: string, metric: "rir" | "pump" | "soreness" | "fatigue", value: number) => void;
  muscleGroup: string;
}

const RecoveryFeedbackSection: React.FC<RecoveryFeedbackSectionProps> = ({
  recoveryFeedback,
  onRecoveryChange,
  muscleGroup,
}) => {
  if (!recoveryFeedback || !onRecoveryChange) return null;

  return (
    <div className="mt-4 p-3 bg-[#1E2226] rounded-md">
      <h3 className="text-sm font-medium mb-2">Recovery Feedback</h3>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Muscle Pump</span>
            <span className="text-xs">{recoveryFeedback.pump}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={recoveryFeedback.pump}
            onChange={e => onRecoveryChange(muscleGroup, "pump", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Muscle Soreness</span>
            <span className="text-xs">{recoveryFeedback.soreness}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={recoveryFeedback.soreness}
            onChange={e => onRecoveryChange(muscleGroup, "soreness", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Muscle Fatigue</span>
            <span className="text-xs">{recoveryFeedback.fatigue}/5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={recoveryFeedback.fatigue}
            onChange={e => onRecoveryChange(muscleGroup, "fatigue", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default RecoveryFeedbackSection;
