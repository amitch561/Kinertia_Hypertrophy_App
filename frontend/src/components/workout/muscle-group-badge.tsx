
import React from "react";
import { Badge } from "@/components/ui/badge";

interface MuscleGroupBadgeProps {
  muscleGroup: string;
}

const MuscleGroupBadge = ({ muscleGroup }: MuscleGroupBadgeProps) => {
  return (
    <Badge variant="outline" className="bg-transparent border-neutral-light text-gray-300">
      {muscleGroup}
    </Badge>
  );
};

export default MuscleGroupBadge;
