
// Fix working-set inputs placeholders clear on focus and allow proper number input handling

import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Set } from "@/types/workout";

interface WorkingSetRowProps {
  set: Set;
  exerciseIndex: number;
  setIndex: number;
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  weightUnit: 'kg' | 'lbs';
}

export const WorkingSetRow: React.FC<WorkingSetRowProps> = ({
  set,
  exerciseIndex,
  setIndex,
  updateExerciseSet,
  weightUnit
}) => {
  const weightInputRef = useRef<HTMLInputElement>(null);
  const repsInputRef = useRef<HTMLInputElement>(null);

  // Track focus state to control placeholder rendering
  const [weightFocused, setWeightFocused] = useState(false);
  const [repsFocused, setRepsFocused] = useState(false);

  const convertWeight = (weight: number, to: 'kg' | 'lbs') => {
    if (to === 'lbs') {
      return weight * 2.20462;
    }
    return weight / 2.20462;
  };

  const handleWeightChange = (value: string) => {
    // Accept only numbers and decimals, allow clearing field
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numericValue = value === '' ? 0 : parseFloat(value);
      const weightInKg = weightUnit === 'lbs' ? convertWeight(numericValue, 'kg') : numericValue;
      updateExerciseSet(exerciseIndex, setIndex, { weight: weightInKg });
    }
  };

  const handleRepsChange = (value: string) => {
    if (value === '' || /^\d*$/.test(value)) {
      const numericValue = value === '' ? 0 : parseInt(value, 10);
      updateExerciseSet(exerciseIndex, setIndex, { reps: numericValue });
    }
  };

  const displayWeight = weightUnit === 'lbs'
    ? (set.weight * 2.20462).toFixed(1)
    : set.weight.toFixed(1);

  const formattedWeight = displayWeight.replace(/\.0$/, '');
  const weightDisplayValue = set.weight === 0 && !weightFocused ? '' : formattedWeight;
  const repsDisplayValue = set.reps === 0 && !repsFocused ? '' : set.reps.toString();

  // Only show placeholder if not focused and the value is empty
  const weightPlaceholder = weightFocused ? '' : 'Weight';
  const repsPlaceholder = repsFocused ? '' : 'Reps';

  return (
    <div
      key={set.id}
      className={`grid grid-cols-4 gap-2 py-2 border-t border-neutral ${
        set.completed ? "text-gray-400" : "text-white"
      }`}
    >
      <div className="flex items-center">
        Set {setIndex + 1}
      </div>
      <div className="flex items-center gap-1">
        <Input
          ref={weightInputRef}
          value={weightDisplayValue}
          onChange={(e) => handleWeightChange(e.target.value)}
          onFocus={() => setWeightFocused(true)}
          onBlur={() => setWeightFocused(false)}
          className="w-16 h-8 bg-neutral border-neutral-light text-center focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder={weightPlaceholder}
          aria-label={`Weight for set ${setIndex + 1}`}
          type="text"
          inputMode="decimal"
          pattern="^\d*\.?\d*$"
        />
        <span>{weightUnit}</span>
      </div>
      <div>
        <Input
          ref={repsInputRef}
          value={repsDisplayValue}
          onChange={(e) => handleRepsChange(e.target.value)}
          onFocus={() => setRepsFocused(true)}
          onBlur={() => setRepsFocused(false)}
          className="w-16 h-8 bg-neutral border-neutral-light text-center focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder={repsPlaceholder}
          aria-label={`Reps for set ${setIndex + 1}`}
          type="text"
          inputMode="numeric"
          pattern="^\d*$"
        />
      </div>
      <div className="text-right">
        <input
          type="checkbox"
          checked={set.completed}
          onChange={() => updateExerciseSet(
            exerciseIndex,
            setIndex,
            { completed: !set.completed }
          )}
          className="h-5 w-5 rounded border-gray-600 text-primary focus:ring-primary"
          aria-label={`Mark set ${setIndex + 1} completed`}
        />
      </div>
    </div>
  );
};
