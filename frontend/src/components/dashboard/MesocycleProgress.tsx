
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card-container";
import { Progress } from "@/components/ui/progress";

interface MesocycleProgressProps {
  currentWeek: number;
  currentDay: number;
  progress: number;
}

const MesocycleProgress = ({ currentWeek, currentDay, progress }: MesocycleProgressProps) => {
  return (
    <Card className="bg-neutral-light border-none mb-6 rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-white">
              Current Mesocycle
            </CardTitle>
            <p className="text-sm text-gray-400">
              Week {currentWeek} • Day {currentDay}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-400">complete</div>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2 bg-neutral" />
      </CardHeader>
    </Card>
  );
};

export default MesocycleProgress;
