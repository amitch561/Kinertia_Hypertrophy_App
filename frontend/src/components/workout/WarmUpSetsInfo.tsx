
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const WarmUpSetsInfo: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center text-sm text-gray-400 cursor-help">
            <span className="mr-1">Warm-up Sets</span>
            <Info className="h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#2A2A2A] border-[#454545] text-white">
          <div className="space-y-2">
            <p>Proper warm-up sets help prepare your muscles and joints:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>First set: 50% of working weight × 10 reps</li>
              <li>Second set: 70% of working weight × 6 reps</li>
              <li>Third set: 90% of working weight × 3 reps</li>
            </ol>
            <p className="text-xs text-gray-400 mt-1">Rest 60-90 seconds between warm-up sets.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WarmUpSetsInfo;
