import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-container";

interface WorkoutProgressProps {
  workoutName: string;
  completionPercentage: number;
}

const WorkoutProgress: React.FC<WorkoutProgressProps> = ({ workoutName, completionPercentage }) => {
  return (
    <Card className="bg-[#2F2F2F] border-[#454545]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">
              {workoutName}
            </CardTitle>
            <CardDescription>
              Track your sets, reps, and weight
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[#E65A00]">{completionPercentage}%</div>
            <div className="text-xs text-gray-400">completed</div>
          </div>
        </div>
        <div className="w-full bg-[#1A1A1A] h-2 rounded-full mt-2">
          <div 
            className="bg-[#E65A00] h-2 rounded-full transition-all" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default WorkoutProgress;
