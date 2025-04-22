
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { Exercise } from "@/types/workout";

interface ExerciseListItemProps {
  exercise: Exercise;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ exercise }) => {
  return (
    <div className="bg-[#303540] p-2 rounded-md flex justify-between items-center">
      <div>
        <p className="text-sm text-white">{exercise.name}</p>
        <div className="flex gap-1 mt-1">
          {exercise.equipment && exercise.equipment.map((eq, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-[#3A3A3A] text-gray-300">
              {eq}
            </Badge>
          ))}
        </div>
      </div>
      <Check className="h-5 w-5 text-green-500" />
    </div>
  );
};

export default ExerciseListItem;
