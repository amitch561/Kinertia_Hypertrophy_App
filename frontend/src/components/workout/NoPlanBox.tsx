
import React from "react";
import { CalendarCheck, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoPlanBoxProps {
  onCreatePlan: () => void;
}

const NoPlanBox: React.FC<NoPlanBoxProps> = ({ onCreatePlan }) => (
  <div className="mb-6 p-4 bg-[#2a3040] border border-[#3a4154] rounded-lg flex items-center justify-between">
    <div>
      <div className="font-medium mb-1 flex items-center gap-2">
        <ChartLine className="h-4 w-4 text-primary" />
        Long-term Planning
      </div>
      <p className="text-sm text-gray-300">
        Create a structured training plan with periodization phases.
      </p>
    </div>
    <Button
      size="sm"
      onClick={onCreatePlan}
      className="bg-primary hover:bg-primary/90"
    >
      <CalendarCheck className="h-4 w-4 mr-2" />
      Create Plan
    </Button>
  </div>
);

export default NoPlanBox;
