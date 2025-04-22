
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowsUpFromLine, AlertTriangle, Calendar, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WeeklyScheduleSelector from "@/components/WeeklyScheduleSelector";
import SplitTypeCards from "./SplitTypeCards";
import VolumeLevelSelector from "./VolumeLevelSelector";
import { Button } from "@/components/ui/button";
import CreateWorkoutHeader from "./CreateWorkoutHeader";

type SplitType = "push_pull_legs" | "upper_lower" | "full_body" | "custom";
type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type VolumeLevel = "minimum" | "moderate" | "maximum";

interface PlanTabContentProps {
  splitType: SplitType;
  onSplitTypeChange: (v: SplitType) => void;
  selectedDays: WeekDay[];
  onDaysChange: (v: WeekDay[]) => void;
  userAvailableDays?: number | string[];
  volumeLevel: VolumeLevel;
  onVolumeLevelChange: (v: VolumeLevel) => void;
  onContinue: () => void;
  currentPhase?: any;
  focusMuscleGroups?: string[];
  onFocusMuscleGroupsChange?: (groups: string[]) => void;
}

const PlanTabContent: React.FC<PlanTabContentProps> = ({
  splitType,
  onSplitTypeChange,
  selectedDays,
  onDaysChange,
  userAvailableDays,
  volumeLevel,
  onVolumeLevelChange,
  onContinue,
  currentPhase,
  focusMuscleGroups = [],
  onFocusMuscleGroupsChange
}) => {
  const availableMuscleGroups = [
    { id: "chest", name: "Chest" },
    { id: "back", name: "Back" },
    { id: "shoulders", name: "Shoulders" },
    { id: "biceps", name: "Biceps" },
    { id: "triceps", name: "Triceps" },
    { id: "quads", name: "Quads" },
    { id: "hamstrings", name: "Hamstrings" },
    { id: "glutes", name: "Glutes" },
    { id: "calves", name: "Calves" },
    { id: "core", name: "Core" }
  ];

  const handleFocusMuscleToggle = (muscleId: string) => {
    if (!onFocusMuscleGroupsChange) return;
    
    const updatedGroups = focusMuscleGroups.includes(muscleId)
      ? focusMuscleGroups.filter(id => id !== muscleId)
      : [...focusMuscleGroups, muscleId];
    
    onFocusMuscleGroupsChange(updatedGroups);
  };

  return (
    <div className="space-y-6">
      <CreateWorkoutHeader />
      
      {currentPhase && (
        <div className="p-3 bg-[#2A2A2A] border border-neutral-800 rounded-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Current Phase: </div>
              <div className="font-medium" style={{ color: currentPhase.color }}>
                {currentPhase.name}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Based on your current phase, we've set the recommended volume level to <span className="capitalize">{volumeLevel}</span>.
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-gray-400">
        <ArrowsUpFromLine className="h-4 w-4" />
        <p>We'll generate your weekly schedule based on your selected days and split.</p>
      </div>
      
      <SplitTypeCards splitType={splitType} onSplitTypeChange={onSplitTypeChange} />
      
      {selectedDays.length < 3 && splitType === "push_pull_legs" && (
        <Alert className="bg-[#3F3F3F] border-[#E65A00]">
          <AlertTriangle className="h-4 w-4 text-[#E65A00]" />
          <AlertDescription>
            PPL works best with 3+ training days. Try Full Body or Upper/Lower for fewer sessions.
          </AlertDescription>
        </Alert>
      )}
      
      {volumeLevel === 'minimum' && (
        <Alert className="mb-4 bg-primary/10 border-primary/20">
          <AlertDescription className="text-sm text-gray-300">
            We'll recommend research-backed exercises focused on compound movements that provide the most benefit for muscle growth with minimal time investment.
          </AlertDescription>
        </Alert>
      )}
      
      <WeeklyScheduleSelector
        selectedDays={selectedDays}
        onDaysChange={onDaysChange}
        defaultDays={userAvailableDays as any}
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Muscle Focus</h3>
        </div>
        <p className="text-sm text-gray-400 mb-3">
          Select muscle groups to emphasize in your training. These will receive additional volume based on your experience level.
        </p>
        <div className="flex flex-wrap gap-2">
          {availableMuscleGroups.map(muscle => (
            <Badge
              key={muscle.id}
              variant="outline"
              className={`cursor-pointer transition-colors ${
                focusMuscleGroups.includes(muscle.id)
                  ? "bg-primary/20 border-primary"
                  : "hover:bg-neutral-700"
              }`}
              onClick={() => handleFocusMuscleToggle(muscle.id)}
            >
              {focusMuscleGroups.includes(muscle.id) && (
                <Target className="h-3 w-3 mr-1" />
              )}
              {muscle.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <VolumeLevelSelector
        volumeLevel={volumeLevel}
        onChange={onVolumeLevelChange}
      />
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={onContinue}
          disabled={selectedDays.length === 0}
          className="bg-[#E65A00] hover:bg-[#FF7A22]"
        >
          Continue to Exercise Selection
        </Button>
      </div>
    </div>
  );
};

export default PlanTabContent;
