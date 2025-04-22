
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface WarmUpSetRowProps {
  weight: number;
  reps: number;
  label: string;
  weightUnit: 'kg' | 'lbs';
  onWeightChange?: (weight: number) => void;
}

export const WarmUpSetRow: React.FC<WarmUpSetRowProps> = ({ 
  weight, 
  reps, 
  label, 
  weightUnit,
  onWeightChange 
}) => {
  const handleWeightChange = (value: string) => {
    // Only update if input is valid number or empty, allowing decimals
    if (value === '' || (!isNaN(parseFloat(value)) && /^\d*\.?\d*$/.test(value))) {
      onWeightChange?.(parseFloat(value) || 0);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 py-2 text-gray-400">
      <div className="flex items-center">{label}</div>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          value={weight.toString()}
          onChange={(e) => handleWeightChange(e.target.value)}
          className="w-16 h-8 bg-neutral border-neutral-light text-center"
          step="any"
          placeholder="0"
        />
        <span>{weightUnit}</span>
      </div>
      <div>{reps} reps</div>
      <div className="text-right">
        <Badge variant="outline" className="bg-transparent border-neutral-light">
          Optional
        </Badge>
      </div>
    </div>
  );
};
