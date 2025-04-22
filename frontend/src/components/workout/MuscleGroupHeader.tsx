
import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface MuscleGroupHeaderProps {
  name: string;
  isFocus: boolean;
  onSetFocus: () => void;
}

const MuscleGroupHeader = ({ name, isFocus, onSetFocus }: MuscleGroupHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">{name}</h2>
        {isFocus && (
          <span className="ml-2 flex items-center whitespace-nowrap px-2 py-0.5 rounded-full bg-[#9b87f5] text-xs text-[#231849] font-bold">
            <Star className="w-3 h-3 mr-1" /> Focus
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSetFocus}
        className="text-xs text-gray-400 hover:bg-[#2C3440] hover:text-white"
      >
        {isFocus ? "Remove Focus" : "Set Focus"}
      </Button>
    </div>
  );
};

export default MuscleGroupHeader;
