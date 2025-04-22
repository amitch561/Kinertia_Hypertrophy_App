
import React from "react";
import { Checkbox } from "@/components/ui/checkbox-input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip-popup";
import { Info, Check } from "lucide-react";

interface ExerciseListItemProps {
  exercise: any;
  checked: boolean;
  onToggle: () => void;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ exercise, checked, onToggle }) => (
  <div
    key={exercise.id}
    className="flex items-start space-x-3 p-2 rounded hover:bg-[#353535] transition-colors"
  >
    <Checkbox
      id={exercise.id}
      checked={checked}
      onCheckedChange={onToggle}
      className="mt-1"
    />
    <div className="flex-1">
      <label
        htmlFor={exercise.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {exercise.name}
        {exercise.recommended && (
          <div className="inline-flex items-center ml-2">
            <Badge variant="secondary" className="bg-[#E65A00] text-xs">
              <Check className="mr-1 h-3 w-3" />
              Recommended
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#2F2F2F] border-[#454545] text-white">
                  <p className="w-[200px] text-xs">
                    Recommended exercises are foundational, safe, and highly effective
                    movements for building muscle in this area.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </label>
      {exercise.description && (
        <p className="text-xs text-gray-400 mt-1">
          {exercise.description}
        </p>
      )}
    </div>
  </div>
);

export default ExerciseListItem;
