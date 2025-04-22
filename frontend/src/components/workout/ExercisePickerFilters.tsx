
import React from "react";
import type { SubGroup } from "@/types/workout";

interface ExercisePickerFiltersProps {
  groupId: string;
  subGroup: SubGroup | null;
}

const ExercisePickerFilters: React.FC<ExercisePickerFiltersProps> = ({
  groupId,
  subGroup
}) => (
  <div className="py-2 px-1">
    <div className="mb-2 text-sm text-[#F97316] font-semibold">
      {groupId && <>Filtered for group: <span className="text-white">{groupId}</span></>}
    </div>
    {subGroup && (
      <div className="mb-3 text-sm font-medium text-slate-200">
        Sub-group: <span className="text-[#F97316]">{subGroup.name}</span>
      </div>
    )}
  </div>
);

export default ExercisePickerFilters;
