
import React from "react";
import { Exercise } from "@/types/workout";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";

interface ExercisePickerExerciseCardProps {
  exercise: Exercise;
  isSelected?: boolean;
  onSelect: (exerciseId: string) => void;
  volumeInfo?: any;
  isRecommended?: boolean;
  recommendationNote?: string;
}

const ExercisePickerExerciseCard: React.FC<ExercisePickerExerciseCardProps> = ({
  exercise,
  isSelected = false,
  onSelect,
  volumeInfo,
  isRecommended = true,
  recommendationNote = ""
}) => {
  // Determine the border color based on selection and recommendation status
  const getBorderColor = () => {
    if (isSelected) return 'border-[#E65A00]';
    if (isRecommended) return 'border-[#454545]';
    return 'border-amber-600/30';
  };

  // Determine badges to show based on exercise type and recommendation
  const showRecommendedBadge = exercise.recommended;
  const showCompoundBadge = exercise.exerciseType === 'compound';
  const showIsolationBadge = exercise.exerciseType === 'isolation';
  
  return (
    <div 
      className={`bg-[#2A2A2A] border ${getBorderColor()} rounded-md p-3 cursor-pointer transition-colors hover:bg-[#353535] ${!isRecommended ? 'opacity-70' : ''}`}
      onClick={() => onSelect(exercise.id)}
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-medium text-white">{exercise.name}</h3>
        <div className="flex gap-1 flex-wrap justify-end">
          {showRecommendedBadge && (
            <Badge className="bg-[#E65A00] text-white text-xs">
              Recommended
            </Badge>
          )}
          {showCompoundBadge && (
            <Badge className="bg-blue-600 text-white text-xs">
              Compound
            </Badge>
          )}
          {showIsolationBadge && (
            <Badge className="bg-purple-600 text-white text-xs">
              Isolation
            </Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-2">{exercise.description}</p>
      
      {!isRecommended && recommendationNote && (
        <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
          <AlertTriangle className="h-3 w-3" />
          <span>{recommendationNote}</span>
        </div>
      )}
      
      {isRecommended && recommendationNote && (
        <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
          <Info className="h-3 w-3" />
          <span>{recommendationNote}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mt-1">
        {exercise.equipment?.map((equipment) => (
          <Badge 
            key={equipment} 
            variant="outline" 
            className="text-xs bg-[#333333] border-[#555555]"
          >
            {equipment}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ExercisePickerExerciseCard;
