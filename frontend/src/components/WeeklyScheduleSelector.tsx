
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";
import { Info, AlertTriangle } from "lucide-react";

const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
] as const;

type WeekDay = typeof DAYS[number]["value"];

interface WeeklyScheduleSelectorProps {
  selectedDays: WeekDay[];
  onDaysChange: (days: WeekDay[]) => void;
  defaultDays?: number; // Changed back to number as it represents a count, not an array
}

const WeeklyScheduleSelector: React.FC<WeeklyScheduleSelectorProps> = ({
  selectedDays,
  onDaysChange,
  defaultDays,
}) => {
  const showWarning = selectedDays.length === 7;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Training Schedule</Label>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px] text-xs">
              Select which days work best for your schedule. 
              Your workout split will adjust automatically.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ToggleGroup
        type="multiple"
        value={selectedDays}
        onValueChange={(value) => onDaysChange(value as WeekDay[])}
        className="justify-start flex-wrap gap-2"
      >
        {DAYS.map((day) => (
          <ToggleGroupItem
            key={day.value}
            value={day.value}
            variant="outline"
            className={`w-14 data-[state=on]:bg-[#E65A00] data-[state=on]:text-white border-[#454545]`}
          >
            {day.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      
      {showWarning ? (
        <Alert variant="destructive" className="bg-[#492C2C] border-[#E65A00] text-white">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Training every day may reduce recovery. Consider scheduling a rest day to support hypertrophy.
          </AlertDescription>
        </Alert>
      ) : (
        <p className="text-sm text-gray-400">
          We recommend including at least 1 rest day per week to support recovery and muscle growth.
          You can change your schedule anytime.
        </p>
      )}
    </div>
  );
};

export default WeeklyScheduleSelector;
