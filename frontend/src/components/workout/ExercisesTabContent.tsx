
import React, { useEffect } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ExerciseSelectionStep from "@/components/ExerciseSelectionStep";
import { Button } from "@/components/ui/button";
import { VolumeStatus } from "@/types/workout";

type SplitType = "push_pull_legs" | "upper_lower" | "full_body" | "custom";
type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type VolumeLevel = "minimum" | "moderate" | "maximum";

interface ExercisesTabContentProps {
  muscleGroups: string[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
  splitType: SplitType;
  selectedDays: WeekDay[];
  isReadOnly: boolean;
  onGeneratePlan: () => void;
  focusMuscleGroups?: string[];
  onFocusMuscleGroupsChange?: (groups: string[]) => void;
  volumeLevel?: VolumeLevel;
}

const ExercisesTabContent: React.FC<ExercisesTabContentProps> = ({
  muscleGroups,
  selectedExercises,
  onExerciseToggle,
  splitType,
  selectedDays,
  isReadOnly,
  onGeneratePlan,
  focusMuscleGroups = [],
  onFocusMuscleGroupsChange,
  volumeLevel = "moderate"
}) => {
  const { exercises, calculateCurrentVolumeStatus } = useWorkout();
  const [volumeStatus, setVolumeStatus] = React.useState<VolumeStatus[]>([]);
  
  // Update volume status whenever focus muscle groups, selected exercises, or volume level changes
  useEffect(() => {
    console.log("Updating volume status with volumeLevel:", volumeLevel, "focusMuscleGroups:", focusMuscleGroups);
    
    // Pass the volumeLevel to calculateCurrentVolumeStatus
    const newVolumeStatus = calculateCurrentVolumeStatus(
      selectedExercises, 
      focusMuscleGroups,
      'beginner', // Default to beginner - this should ideally come from user context
      volumeLevel  // Pass the volumeLevel parameter
    );
    setVolumeStatus(newVolumeStatus);
  }, [calculateCurrentVolumeStatus, selectedExercises, focusMuscleGroups, volumeLevel]);

  const handleFocusMuscleToggle = (muscleGroup: string) => {
    if (onFocusMuscleGroupsChange) {
      const updatedGroups = focusMuscleGroups.includes(muscleGroup)
        ? focusMuscleGroups.filter(m => m !== muscleGroup)
        : [...focusMuscleGroups, muscleGroup];
      
      console.log("Focus muscle groups changed:", updatedGroups);
      onFocusMuscleGroupsChange(updatedGroups);
    }
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-[#2a3040] border border-[#3a4154] rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Muscle Focus</h3>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">
          Select muscle groups to emphasize in your workout plan:
        </p>
        
        <div className="flex flex-wrap gap-2">
          {muscleGroups.map(muscle => (
            <Badge
              key={muscle}
              variant="outline"
              className={`cursor-pointer transition-colors ${
                focusMuscleGroups.includes(muscle)
                  ? "bg-primary/20 border-primary"
                  : "hover:bg-neutral-700"
              }`}
              onClick={() => handleFocusMuscleToggle(muscle)}
            >
              {muscle}
            </Badge>
          ))}
        </div>
      </div>

      <ExerciseSelectionStep
        muscleGroups={muscleGroups}
        selectedExercises={selectedExercises}
        onExerciseToggle={onExerciseToggle}
        splitType={splitType}
        selectedDays={selectedDays}
        isReadOnly={isReadOnly}
        focusMuscleGroups={focusMuscleGroups}
        volumeLevel={volumeLevel}
        volumeStatus={volumeStatus}
        userExperience='beginner'
      />
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onGeneratePlan}
          className="bg-[#E65A00] hover:bg-[#FF7A22]"
        >
          Generate Plan
        </Button>
      </div>
    </div>
  );
};

export default ExercisesTabContent;
