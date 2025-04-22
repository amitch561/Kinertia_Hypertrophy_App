import React from 'react';
import { Card, CardContent } from "@/components/ui/card-container";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";
import { Check, Lock } from "lucide-react";
import { Workout } from "@/types/workout";

interface DayTileProps {
  workout: Workout;
  dayIndex: number;
  isCompleted: boolean;
  isEnabled: boolean;
  onSelect: () => void;
}

const DayTile: React.FC<DayTileProps> = ({
  workout,
  dayIndex,
  isCompleted,
  isEnabled,
  onSelect,
}) => {
  // Calculate actual exercise and working set counts
  const exerciseCount = workout?.exercises?.filter(ex => 
    ex.sets.some(set => !set.isWarmUp)
  ).length || 0;
  
  const workingSets = workout?.exercises?.reduce((total, exercise) => {
    if (!exercise?.sets) return total;
    return total + exercise.sets.filter(set => !set.isWarmUp).length;
  }, 0) || 0;

  const tileContent = (
    <Card 
      className={`flex-shrink-0 w-[200px] cursor-pointer transition-all duration-200 rounded-xl ${
        isEnabled 
          ? isCompleted 
            ? 'bg-neutral-light' 
            : 'bg-primary hover:bg-primary-dark'
          : 'bg-neutral opacity-50 cursor-not-allowed'
      } border-none`}
      onClick={() => isEnabled && onSelect()}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Day {dayIndex + 1}
          </span>
          {isCompleted ? (
            <Check className="h-4 w-4 text-primary" />
          ) : !isEnabled && (
            <Lock className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <h4 className="text-sm font-semibold mb-2 line-clamp-1">
          {workout?.name || "Workout"}
        </h4>
        <div className="text-xs text-gray-400">
          {exerciseCount > 0 ? (
            <>
              <div>{exerciseCount} exercises</div>
              <div>{workingSets} working sets</div>
            </>
          ) : (
            <div>No working sets planned</div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!isEnabled && !isCompleted) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {tileContent}
          </TooltipTrigger>
          <TooltipContent className="bg-neutral border-neutral-light rounded-lg">
            <p>Complete Day {dayIndex} to unlock Day {dayIndex + 1}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return tileContent;
};

export default DayTile;
