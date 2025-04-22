
import { Exercise } from "@/types/workout";
import { Toggle } from "@/components/ui/toggle-button";
import { Dumbbell, Weight } from "lucide-react";
import MuscleGroupBadge from "./muscle-group-badge";

interface ExerciseHeaderProps {
  exerciseDetails: Exercise;
  weightUnit: 'kg' | 'lbs';
  onWeightUnitToggle: () => void;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  exerciseDetails,
  weightUnit,
  onWeightUnitToggle
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Dumbbell className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium text-white">{exerciseDetails.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Toggle
          aria-label="Toggle weight unit"
          pressed={weightUnit === 'lbs'}
          onPressedChange={onWeightUnitToggle}
          className="bg-transparent border-neutral hover:bg-neutral hover:text-white data-[state=on]:bg-primary data-[state=on]:text-white"
        >
          <Weight className="h-4 w-4 mr-1" />
          {weightUnit.toUpperCase()}
        </Toggle>
        <MuscleGroupBadge muscleGroup={exerciseDetails.muscleGroup} />
      </div>
    </div>
  );
};
