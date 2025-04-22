
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { WarmUpSetRow } from "./warm-up-set-row";
import { Set } from "@/types/workout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";

interface WarmUpSetsProps {
  baseWeight: number;
  previousPerformance?: {
    date: string;
    weight: number;
    reps: number;
  }[];
  weightUnit: 'kg' | 'lbs';
}

export const WarmUpSets: React.FC<WarmUpSetsProps> = ({ baseWeight, previousPerformance, weightUnit }) => {
  const [warmUpWeights, setWarmUpWeights] = React.useState(() => {
    if (previousPerformance && previousPerformance.length >= 2) {
      const sortedPerformance = [...previousPerformance].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const latestWeight = sortedPerformance[0].weight;
      const previousWeight = sortedPerformance[1].weight;
      
      if (latestWeight > previousWeight) {
        return {
          set1: latestWeight * 0.4,
          set2: latestWeight * 0.6,
          set3: latestWeight * 0.75,
        };
      }
    }
    
    return {
      set1: baseWeight * 0.4,
      set2: baseWeight * 0.6,
      set3: baseWeight * 0.75,
    };
  });
  
  // Convert weight between units while preserving exact decimal values
  const convertWeight = (weight: number) => {
    if (weightUnit === 'lbs') {
      return weight * 2.20462;
    }
    return weight;
  };

  const handleWeightChange = (setKey: keyof typeof warmUpWeights, weight: number) => {
    setWarmUpWeights(prev => ({
      ...prev,
      [setKey]: weightUnit === 'lbs' ? weight / 2.20462 : weight
    }));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-400">Warm-Up Sets</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="bg-neutral border-neutral-light text-gray-200 max-w-[300px] rounded-lg">
              Warm-up sets are used to gradually prepare your muscles and joints. Start with lighter weights and increase gradually. Example: 40%, 60%, and 75% of your working set weight.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Alert className="mb-4 bg-neutral border-neutral-light rounded-lg">
        <Info className="h-4 w-4 text-gray-400" />
        <AlertDescription className="text-gray-300 text-sm">
          Complete these optional warm-up sets to prepare your muscles.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-1">
        <WarmUpSetRow 
          weight={convertWeight(warmUpWeights.set1)} 
          reps={12} 
          label="Warm-Up 1" 
          weightUnit={weightUnit}
          onWeightChange={(w) => handleWeightChange('set1', w)}
        />
        <WarmUpSetRow 
          weight={convertWeight(warmUpWeights.set2)} 
          reps={8} 
          label="Warm-Up 2" 
          weightUnit={weightUnit}
          onWeightChange={(w) => handleWeightChange('set2', w)}
        />
        <WarmUpSetRow 
          weight={convertWeight(warmUpWeights.set3)} 
          reps={4} 
          label="Warm-Up 3" 
          weightUnit={weightUnit}
          onWeightChange={(w) => handleWeightChange('set3', w)}
        />
      </div>
    </div>
  );
};
