
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ExercisePickerHeaderProps {
  title?: string;
  description?: string;
}

const ExercisePickerHeader: React.FC<ExercisePickerHeaderProps> = ({
  title = "Pick an Exercise",
  description = "Select an exercise to add to your workout"
}) => (
  <DialogHeader>
    <DialogTitle className="text-xl text-white">{title}</DialogTitle>
    <DialogDescription className="text-gray-400">
      {description}
    </DialogDescription>
  </DialogHeader>
);

export default ExercisePickerHeader;
