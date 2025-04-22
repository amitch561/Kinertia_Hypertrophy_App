
import React from 'react';

interface CurrentPhaseDisplayProps {
  currentPhase: {
    name: string;
    color: string;
    focusType: string;
  } | null;
}

const CurrentPhaseDisplay = ({ currentPhase }: CurrentPhaseDisplayProps) => {
  if (!currentPhase) return null;

  return (
    <div className="mb-4 p-3 bg-[#2a3040] rounded-lg border border-[#3a4154]">
      <div className="text-xs uppercase text-gray-400 tracking-wider mb-1">Current Training Phase:</div>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg" style={{ color: currentPhase.color }}>
          {currentPhase.name}
        </span>
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md capitalize">
          {currentPhase.focusType} Focus
        </span>
      </div>
    </div>
  );
};

export default CurrentPhaseDisplay;
