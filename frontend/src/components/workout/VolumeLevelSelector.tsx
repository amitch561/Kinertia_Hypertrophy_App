
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-container";
import { TrendingUp, Dumbbell, Target } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface VolumeLevelSelectorProps {
  volumeLevel: 'minimum' | 'moderate' | 'maximum';
  onChange: (value: 'minimum' | 'moderate' | 'maximum') => void;
}

const VolumeLevelSelector: React.FC<VolumeLevelSelectorProps> = ({
  volumeLevel,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <Label className="text-base font-medium">Weekly Volume Target</Label>
      </div>
      
      <RadioGroup
        value={volumeLevel}
        onValueChange={onChange as (value: string) => void}
        className="grid grid-cols-3 gap-4"
      >
        <div>
          <RadioGroupItem
            value="minimum"
            id="minimum"
            className="peer sr-only"
          />
          <Label
            htmlFor="minimum"
            className="flex flex-col p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50 cursor-pointer peer-data-[state=checked]:border-primary/70 peer-data-[state=checked]:bg-primary/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Minimum</span>
              <div className="bg-yellow-700/30 text-yellow-400 text-xs px-2 py-0.5 rounded">MEV</div>
            </div>
            <span className="mt-2 text-sm text-gray-400">
              Minimal Effective Volume. Fewer total sets for time-efficiency and beginners. Great for busy schedules.
            </span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem
            value="moderate"
            id="moderate"
            className="peer sr-only"
          />
          <Label
            htmlFor="moderate"
            className="flex flex-col p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50 cursor-pointer peer-data-[state=checked]:border-primary/70 peer-data-[state=checked]:bg-primary/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Moderate</span>
              <div className="bg-green-700/30 text-green-400 text-xs px-2 py-0.5 rounded">Optimal</div>
            </div>
            <span className="mt-2 text-sm text-gray-400">
              Research-backed optimal volume for most people. Balances stimulus and recovery for consistent growth.
            </span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem
            value="maximum"
            id="maximum"
            className="peer sr-only"
          />
          <Label
            htmlFor="maximum"
            className="flex flex-col p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50 cursor-pointer peer-data-[state=checked]:border-primary/70 peer-data-[state=checked]:bg-primary/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Maximum</span>
              <div className="bg-orange-700/30 text-orange-400 text-xs px-2 py-0.5 rounded">MRV</div>
            </div>
            <span className="mt-2 text-sm text-gray-400">
              Maximum Recoverable Volume. Higher total sets for advanced lifters. Requires good recovery capabilities.
            </span>
          </Label>
        </div>
      </RadioGroup>
      
      <div className="text-sm text-gray-400 mt-2">
        <div className="flex items-baseline gap-1">
          <Dumbbell className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            {volumeLevel === 'minimum' && 'Lower volume focuses on compound movements with fewer total sets per muscle group. Ideal for beginners or when recovery is limited.'}
            {volumeLevel === 'moderate' && 'Balanced volume approach with scientific support for optimal hypertrophy. Suitable for most experience levels.'}
            {volumeLevel === 'maximum' && 'Higher volume for experienced lifters looking to maximize stimulus. Ensure adequate recovery, nutrition, and sleep.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VolumeLevelSelector;
