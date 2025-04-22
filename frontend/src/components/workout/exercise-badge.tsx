
import React from "react";
import { Exercise } from "@/types/workout";
import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isStretchFocused } from "@/utils/exerciseMetrics";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExerciseBadgeProps {
  exercise: Exercise;
  isSelected: boolean;
  isRecommended: boolean;
  isReadOnly: boolean;
  onToggle: () => void;
  getSecondaryMuscleImpact: (exercise: Exercise) => string[];
}

const ExerciseBadge: React.FC<ExerciseBadgeProps> = ({
  exercise,
  isSelected,
  isRecommended,
  isReadOnly,
  onToggle,
  getSecondaryMuscleImpact,
}) => {
  const isStretchHypertrophy = isStretchFocused(exercise.id);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "cursor-pointer transition-colors",
            isSelected 
              ? "bg-primary/20 border-primary" 
              : isRecommended 
                ? "hover:bg-neutral-700" 
                : "opacity-40 hover:bg-neutral-700",
            isReadOnly && "cursor-not-allowed opacity-75"
          )}
          onClick={onToggle}
        >
          {isSelected && (
            <Check className="h-3 w-3 mr-1" />
          )}
          <span className="flex items-center gap-2">
            {exercise.name}
            {isStretchHypertrophy && (
              <span className="ml-1 text-xs bg-purple-600 px-1.5 py-0.5 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" /> Stretch
              </span>
            )}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="bg-[#2A2A2A] text-white border-[#454545]">
        <div className="space-y-1">
          <p className="text-sm font-medium">{exercise.name}</p>
          <p className="text-xs text-gray-400">
            {exercise.description}
          </p>
          {isStretchHypertrophy && (
            <p className="text-xs text-purple-400">
              Prioritizes loaded stretch for maximal growth
            </p>
          )}
          {!isRecommended && !isSelected && (
            <p className="text-xs text-amber-400">
              This muscle is already trained by other selected movements.
            </p>
          )}
          {getSecondaryMuscleImpact(exercise).length > 0 && (
            <p className="text-xs text-blue-400">
              Also trains: {getSecondaryMuscleImpact(exercise).join(', ')}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default ExerciseBadge;
