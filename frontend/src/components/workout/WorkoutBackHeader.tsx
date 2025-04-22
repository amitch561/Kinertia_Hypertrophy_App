
import React from "react";
import { Button } from "@/components/ui/button-component";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutBackHeaderProps {
  title?: string;
}

const WorkoutBackHeader: React.FC<WorkoutBackHeaderProps> = ({ title = "Workout" }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center px-4 pt-3 pb-1 sticky top-0 bg-[#1A1F2C] z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/dashboard")}
        aria-label="Back to Dashboard"
      >
        <ArrowLeft className="h-6 w-6 text-[#8E9196]" />
      </Button>
      <span className="ml-2 text-lg text-white font-semibold">{title}</span>
    </div>
  );
};

export default WorkoutBackHeader;
