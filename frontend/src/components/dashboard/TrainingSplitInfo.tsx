
import React from 'react';
import { Card } from "@/components/ui/card-container";
import type { Workout } from "@/types/workout";
import { getSplitForDay } from "@/utils/workoutDayUtils";

const TrainingSplitInfo = ({ workoutPlan }: { workoutPlan: Workout[] }) => {
  const getTrainingSplitName = () => {
    if (!workoutPlan || workoutPlan.length === 0) return "No training split created";
    
    const muscleGroupCounts: Record<string, number> = {};
    const typePatterns: Record<string, boolean> = {
      'push_pull_legs': false,
      'upper_lower': false,
      'full_body': false
    };

    workoutPlan.forEach((workout, index) => {
      const splitType = getSplitForDay(index, 'push_pull_legs', ['mon', 'tue', 'wed', 'thu', 'fri']);
      
      switch (splitType) {
        case 'push':
          muscleGroupCounts['push'] = (muscleGroupCounts['push'] || 0) + 1;
          break;
        case 'pull':
          muscleGroupCounts['pull'] = (muscleGroupCounts['pull'] || 0) + 1;
          break;
        case 'legs':
          muscleGroupCounts['legs'] = (muscleGroupCounts['legs'] || 0) + 1;
          break;
        case 'upper':
          typePatterns['upper_lower'] = true;
          break;
        case 'lower':
          typePatterns['upper_lower'] = true;
          break;
        default:
          typePatterns['full_body'] = true;
      }
    });

    if (muscleGroupCounts['push'] && muscleGroupCounts['pull'] && muscleGroupCounts['legs']) {
      typePatterns['push_pull_legs'] = true;
    }

    if (typePatterns['push_pull_legs']) {
      return `Push/Pull/Legs (${workoutPlan.length} day split)`;
    } else if (typePatterns['upper_lower']) {
      return `Upper/Lower (${workoutPlan.length} day split)`;
    } else if (typePatterns['full_body']) {
      return `Full Body (${workoutPlan.length} day split)`;
    } else {
      return `${workoutPlan.length} day training split`;
    }
  };

  return (
    <div className="mb-4 p-3 bg-[#2a3040] rounded-lg border border-[#3a4154]">
      <div className="text-xs uppercase text-gray-400 tracking-wider mb-1">Training Split:</div>
      <div className="font-semibold">
        {getTrainingSplitName()}
      </div>
    </div>
  );
};

export default TrainingSplitInfo;
