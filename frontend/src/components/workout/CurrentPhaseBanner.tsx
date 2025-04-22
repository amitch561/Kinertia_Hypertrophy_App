
import React from "react";
import { Card } from "@/components/ui/card-container";

interface CurrentPhaseBannerProps {
  currentPhase: any;
  volumeLevel: string;
}

const CurrentPhaseBanner: React.FC<CurrentPhaseBannerProps> = ({ currentPhase, volumeLevel }) => {
  if (!currentPhase) return null;
  return (
    <Card className="mb-8 p-6 bg-[#2a3040] border border-[#3a4154] rounded-lg max-w-4xl mx-auto shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-gray-400 tracking-wider mb-1">Current Training Phase:</div>
          <div className="font-semibold text-lg" style={{ color: currentPhase.color }}>
            {currentPhase.name}
          </div>
          <div className="text-base mt-1">
            Focus: <span className="text-primary capitalize">{currentPhase.focusType}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase text-gray-400 tracking-wider mb-1">Recommended Volume:</div>
          <div className="text-base capitalize bg-primary/25 text-primary px-3 py-2 rounded-lg font-semibold">
            {volumeLevel}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrentPhaseBanner;
