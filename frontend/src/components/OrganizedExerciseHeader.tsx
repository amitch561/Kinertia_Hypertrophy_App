
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrganizedExerciseHeaderProps {
  muscleGroup: string;
  exerciseCount: number;
}

const OrganizedExerciseHeader: React.FC<OrganizedExerciseHeaderProps> = ({
  muscleGroup,
  exerciseCount,
}) => (
  <div className="flex items-center gap-2">
    <h3 className="text-lg font-semibold capitalize">{muscleGroup}</h3>
    <Badge variant="outline" className="bg-[#404040] text-xs">
      {exerciseCount}
    </Badge>
  </div>
);

export default OrganizedExerciseHeader;
