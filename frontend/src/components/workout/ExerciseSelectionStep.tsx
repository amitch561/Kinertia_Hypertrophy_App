
import React from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip-popup";
import BeginnersGuideAlert from "./BeginnersGuideAlert";
import VolumeStatusAlert from "./volume-status-alert";
import ShoulderTargetingOverride from "./shoulder-targeting-override";
import { useBeginnerRecommendations } from "@/hooks/useBeginnerRecommendations";
import { useShoulderBalancing } from "@/hooks/useShoulderBalancing";
import { getSplitForDay, getSplitDisplayName, splitMuscleGroups, dayNames, getPushDaysCount } from "@/utils/workoutDayUtils";
import { ExerciseSelectionProps } from "@/types/exercise-selection";
import VolumeLevelHandler from "../exercise-selection/VolumeLevelHandler";
import ExerciseModalHandler from "../exercise-selection/ExerciseModalHandler";
import WorkoutDaysList from "../exercise-selection/WorkoutDaysList";

type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const ExerciseSelectionStep = ({
  muscleGroups,
  selectedExercises,
  onExerciseToggle,
  splitType,
  selectedDays,
  isReadOnly = false,
  focusMuscleGroups = [],
  volumeLevel = "moderate",
  volumeStatus = [],
  userExperience = 'beginner',
  skipSubGroups = {},
}: ExerciseSelectionProps) => {
  const { exercises, workoutPlan, completedWorkouts } = useWorkout();
  const { showBeginnersGuide } = useBeginnerRecommendations(exercises, selectedExercises, onExerciseToggle);
  const { shoulderFocusOverride, setShouldFocusOverride, handleShoulderFocusToggle } = useShoulderBalancing(
    exercises,
    selectedExercises,
    selectedDays,
    splitType,
    onExerciseToggle
  );

  const typedSelectedDays = selectedDays.map(day => day as WeekDay);

  const workoutDays = typedSelectedDays.map((day, index) => {
    const split = getSplitForDay(index, splitType, selectedDays);
    return {
      day: dayNames[day],
      dayCode: day,
      split: split,
      splitLabel: getSplitDisplayName(split),
      muscleGroups: splitMuscleGroups[split] || []
    };
  });

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {showBeginnersGuide && <BeginnersGuideAlert />}
        
        <VolumeLevelHandler
          volumeLevel={volumeLevel}
          selectedExercises={selectedExercises}
          exercises={exercises}
          muscleGroups={muscleGroups}
          onExerciseToggle={onExerciseToggle}
        />
        
        {volumeStatus.length > 0 && (
          <VolumeStatusAlert 
            volumeStatus={volumeStatus} 
            muscleGroups={muscleGroups}
            focusMuscleGroups={focusMuscleGroups}
            experience={userExperience}
            volumeLevel={volumeLevel}
          />
        )}
        
        {exercises.length > 0 && getPushDaysCount(selectedDays, splitType) >= 2 && (
          <ShoulderTargetingOverride
            shoulderFocusOverride={shoulderFocusOverride}
            onOverrideChange={setShouldFocusOverride}
          />
        )}
        
        <ScrollArea className="h-[60vh] pr-4">
          <WorkoutDaysList
            workoutDays={workoutDays}
            exercises={exercises}
            selectedExercises={selectedExercises}
            onExerciseToggle={handleShoulderFocusToggle}
            volumeStatus={volumeStatus}
            isReadOnly={isReadOnly}
            focusMuscleGroups={focusMuscleGroups}
            skipSubGroups={skipSubGroups}
          />
        </ScrollArea>

        <ExerciseModalHandler
          selectedExercises={selectedExercises}
          onSelectExercise={onExerciseToggle}
          focusMuscleGroups={focusMuscleGroups}
        />
      </div>
    </TooltipProvider>
  );
};

export default ExerciseSelectionStep;
