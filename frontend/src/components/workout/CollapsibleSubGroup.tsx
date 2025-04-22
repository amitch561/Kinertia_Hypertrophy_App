
import React, { useState, useEffect } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";
import { isPressingMovement } from "@/lib/workout/exercises/secondaryMuscleMap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible-panel";
import { Switch } from "@/components/ui/switch-toggle";
import type { Exercise, SubGroupMetadata } from "@/types/workout";

interface CollapsibleSubGroupProps {
  subGroupId: string;
  subGroup: SubGroupMetadata;
  exercises: Exercise[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
  isSecondary: boolean;
  tooltipContent: string;
}

const CollapsibleSubGroup: React.FC<CollapsibleSubGroupProps> = ({
  subGroupId,
  subGroup,
  exercises,
  selectedExercises,
  onExerciseToggle,
  isSecondary,
  tooltipContent,
}) => {
  // Check if this is the anterior deltoid subgroup
  const isAnteriorDelts = subGroupId === 'front' && subGroup.primaryGroup === 'shoulders';
  
  // Check if there are pressing movements selected
  const hasPressingMovements = selectedExercises.some(isPressingMovement);
  
  // Initialize collapsed state based on anterior delt logic
  const [isOpen, setIsOpen] = useState(!isAnteriorDelts || !hasPressingMovements);
  const [isEmphasized, setIsEmphasized] = useState(false);

  // Update collapsed state when pressing movements change
  useEffect(() => {
    if (isAnteriorDelts && !isEmphasized) {
      setIsOpen(!hasPressingMovements);
    }
  }, [hasPressingMovements, isAnteriorDelts, isEmphasized]);

  const handleEmphasisToggle = (checked: boolean) => {
    setIsEmphasized(checked);
    setIsOpen(checked);
  };

  // Special tooltip for anterior delts when pressing movements are present
  const getTooltipContent = () => {
    if (isAnteriorDelts && hasPressingMovements) {
      return "Front delts already get plenty of work from pressing movements; expand if they're a personal weak point.";
    }
    return tooltipContent;
  };

  return (
    <div className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-2 bg-[#2A2A2A] rounded-t-lg">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "transform rotate-180"
              )} />
            </CollapsibleTrigger>
            <span className="text-sm font-medium">{subGroup.name}</span>
            {(isSecondary || (isAnteriorDelts && hasPressingMovements)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{getTooltipContent()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {isAnteriorDelts && hasPressingMovements && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Add Direct Work</span>
              <Switch
                checked={isEmphasized}
                onCheckedChange={handleEmphasisToggle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          )}
        </div>
        <CollapsibleContent>
          <div className="p-2 bg-[#2A2A2A] rounded-b-lg">
            <Select 
              onValueChange={onExerciseToggle}
              value={selectedExercises.find(id => 
                exercises.find(e => e.id === id && getSubGroupId(e) === subGroupId)
              )}
            >
              <SelectTrigger className="w-full bg-[#2A2A2A] border border-[#454545] text-white">
                <SelectValue placeholder={`Select ${subGroup.name} exercise`} />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border border-[#454545] text-white">
                {exercises.map((exercise) => (
                  <SelectItem 
                    key={exercise.id} 
                    value={exercise.id}
                    className="flex items-center justify-between"
                  >
                    <span>{exercise.name}</span>
                    {exercise.recommended && (
                      <Badge variant="secondary" className="ml-2">
                        Recommended
                      </Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleSubGroup;
