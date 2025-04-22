
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isStretchFocused } from "@/utils/exerciseMetrics";
import type { Exercise } from "@/types/workout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";

interface SubGroupExerciseSelectorProps {
  subGroupName: string;
  exercises: Exercise[];
  selectedExercise?: Exercise;
  onExerciseChange: (value: string) => void;
  isReadOnly?: boolean;
  onSkip?: (exerciseId: string) => void;
  onReplace?: (exerciseId: string) => void;
  showAsDashboard?: boolean;
  isFocus?: boolean;
  isSecondary?: boolean;
  secondaryInfo?: string;
}

const SubGroupExerciseSelector = ({
  subGroupName,
  exercises,
  selectedExercise,
  onExerciseChange,
  isReadOnly = false,
  onSkip,
  onReplace,
  showAsDashboard = false,
  isFocus = false,
  isSecondary = false,
  secondaryInfo
}: SubGroupExerciseSelectorProps) => {
  // Sort exercises to show stretch-focused first, then compounds, then others
  const sortedExercises = [...exercises].sort((a, b) => {
    // First by stretch focus
    if (isStretchFocused(a.id) && !isStretchFocused(b.id)) return -1;
    if (!isStretchFocused(a.id) && isStretchFocused(b.id)) return 1;
    // Then by exercise type
    if ((a as any).exerciseType === 'compound' && (b as any).exerciseType !== 'compound') return -1;
    if ((a as any).exerciseType !== 'compound' && (b as any).exerciseType === 'compound') return 1;
    // Then by recommendation status
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    // Finally by name
    return a.name.localeCompare(b.name);
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`📋 SubGroupExerciseSelector for ${subGroupName}:`, {
      exerciseCount: exercises.length,
      sortedExerciseCount: sortedExercises.length,
      selectedExercise: selectedExercise?.name
    });
  }

  // If showing as dashboard, show a card style selector
  if (showAsDashboard && selectedExercise) {
    return (
      <div className="p-3 bg-[#2A2A2A] border border-[#454545] rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">{subGroupName}</span>
            <span className="text-white font-medium">{selectedExercise.name}</span>
          </div>
          <div className="flex gap-2">
            {onReplace && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onReplace(selectedExercise.id)}
                className="text-xs"
              >
                Replace
              </Button>
            )}
            {onSkip && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSkip(selectedExercise.id)}
                className="text-xs text-gray-400"
              >
                <X className="h-4 w-4 mr-1" />
                Skip
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className={`w-32 text-sm ${isFocus ? 'font-bold text-white' : 'font-medium text-gray-300'} flex items-center gap-1`}>
        {subGroupName}
        {isSecondary && secondaryInfo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{secondaryInfo}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {isReadOnly && selectedExercise ? (
        <div className={`flex-1 px-3 py-2 ${isFocus ? 'bg-[#3a3a4a] border-[#9b87f5]' : 'bg-[#2A2A2A] border-[#454545]'} border rounded-md`}>
          <div className="flex items-center justify-between">
            <span className="text-white">{selectedExercise.name}</span>
            {(selectedExercise as any).exerciseType && (
              <Badge 
                variant={(selectedExercise as any).exerciseType === 'compound' ? 'default' : 'secondary'}
                className={(selectedExercise as any).exerciseType === 'compound'
                  ? 'bg-blue-600 text-white text-xs'
                  : 'bg-purple-600 text-white text-xs'
                }
              >
                {(selectedExercise as any).exerciseType}
              </Badge>
            )}
          </div>
        </div>
      ) : (
        <Select
          value={selectedExercise?.id || ""}
          onValueChange={onExerciseChange}
          disabled={isReadOnly}
        >
          <SelectTrigger className={`w-full ${isFocus ? 'bg-[#2d2d3d] border-[#9b87f5]' : 'bg-[#2A2A2A] border-[#454545]'} text-white hover:bg-[#353535] transition-colors focus:ring-2 focus:ring-[#E65A00] focus:ring-opacity-50`}>
            <SelectValue placeholder="Select exercise" />
          </SelectTrigger>
          <SelectContent 
            className="bg-[#2A2A2A] border border-[#454545] shadow-lg text-white z-50 max-h-[300px]"
            position="popper"
            sideOffset={5}
          >
            {sortedExercises.length === 0 ? (
              <div className="py-2 px-2 text-sm text-gray-400">No exercises available</div>
            ) : (
              sortedExercises.map((exercise) => (
                <SelectItem 
                  key={exercise.id} 
                  value={exercise.id}
                  className="font-medium hover:bg-[#3A3A3A] py-2 px-3 cursor-pointer text-white flex justify-between items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{exercise.name}</span>
                    <div className="flex gap-1 items-center">
                      {exercise.recommended && (
                        <Badge className="bg-[#E65A00] text-white text-xs">
                          Recommended
                        </Badge>
                      )}
                      {(exercise as any).exerciseType && (
                        <Badge 
                          variant={(exercise as any).exerciseType === 'compound' ? 'default' : 'secondary'}
                          className={(exercise as any).exerciseType === 'compound'
                            ? 'bg-blue-600 text-white text-xs'
                            : 'bg-purple-600 text-white text-xs'
                          }
                        >
                          {(exercise as any).exerciseType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SubGroupExerciseSelector;
