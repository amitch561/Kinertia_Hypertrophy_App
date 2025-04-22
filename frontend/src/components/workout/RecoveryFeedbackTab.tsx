
import React from "react";

interface RecoveryFeedbackTabProps {
  uniqueMuscleGroups: string[];
  recoveryFeedback: { muscleGroup: string; rir: number; pump: number; soreness: number; fatigue: number }[];
  updateRecoveryFeedback: (muscleGroup: string, metric: "rir" | "pump" | "soreness" | "fatigue", value: number) => void;
}

const RecoveryFeedbackTab = ({
  uniqueMuscleGroups,
  recoveryFeedback,
  updateRecoveryFeedback,
}: RecoveryFeedbackTabProps) => (
  <div className="mb-4 p-3 bg-[#2A2A2A] rounded-lg">
    <h3 className="text-lg font-medium text-white mb-2">Recovery Feedback</h3>
    <p className="text-gray-300 text-sm mb-4">
      Rate how each muscle group feels after this workout. This helps optimize your next workout.
    </p>
    <div className="space-y-4">
      {uniqueMuscleGroups.map((muscleGroup) => (
        <div key={muscleGroup} className="rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-medium capitalize">{muscleGroup}</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">RIR (Reps in Reserve)</span>
                <span className="text-xs font-medium">
                  {recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.rir || 0}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.rir || 0}
                onChange={e => updateRecoveryFeedback(muscleGroup, "rir", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">Muscle Pump</span>
                <span className="text-xs font-medium">
                  {recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.pump || 3}/5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.pump || 3}
                onChange={e => updateRecoveryFeedback(muscleGroup, "pump", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">Muscle Soreness</span>
                <span className="text-xs font-medium">
                  {recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.soreness || 3}/5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.soreness || 3}
                onChange={e => updateRecoveryFeedback(muscleGroup, "soreness", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-400">Muscle Fatigue</span>
                <span className="text-xs font-medium">
                  {recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.fatigue || 3}/5
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={recoveryFeedback.find(f => f.muscleGroup === muscleGroup)?.fatigue || 3}
                onChange={e => updateRecoveryFeedback(muscleGroup, "fatigue", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecoveryFeedbackTab;
