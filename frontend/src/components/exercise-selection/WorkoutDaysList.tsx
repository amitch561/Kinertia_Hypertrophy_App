
import React from "react";
import DayExerciseSelection from "@/components/DayExerciseSelection";
import type { Exercise, VolumeStatus } from "@/types/workout";

// Define WeekDay type locally since it's not exported from "@/types/workout"
type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type WorkoutDay = {
  day: string;
  dayCode: WeekDay;
  split: string;
  splitLabel: string;
  muscleGroups: string[];
};

type WorkoutDaysListProps = {
  workoutDays: WorkoutDay[];
  exercises: Exercise[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string, isPushDay?: number) => void;
  volumeStatus: VolumeStatus[];
  isReadOnly?: boolean;
  onOpenExercisePicker?: (muscleGroup: string, subGroupName: string) => void;
  focusMuscleGroups?: string[];
  skipSubGroups?: Record<string, string[]>;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
};

const WorkoutDaysList = ({
  workoutDays,
  exercises,
  selectedExercises,
  onExerciseToggle,
  volumeStatus,
  isReadOnly = false,
  onOpenExercisePicker,
  focusMuscleGroups = [],
  skipSubGroups = {},
  userExperience = 'beginner',
}: WorkoutDaysListProps) => {
  const normalizeCase = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="space-y-4">
      {workoutDays.map(({ day, dayCode, split, splitLabel, muscleGroups }, index) => {
        const normalizedMuscleGroups = muscleGroups.map(normalizeCase);
        const relevantVolumeStatus = volumeStatus.filter(status => 
          normalizedMuscleGroups.includes(normalizeCase(status.muscleGroup))
        );

        return (
          <DayExerciseSelection
            key={dayCode}
            day={day}
            splitLabel={splitLabel}
            muscleGroups={normalizedMuscleGroups}
            exercises={exercises}
            selectedExercises={selectedExercises}
            onExerciseToggle={split === 'push' 
              ? (exerciseId) => onExerciseToggle(exerciseId, index + 1)
              : onExerciseToggle
            }
            isPushDaySequence={split === 'push' ? index + 1 : undefined}
            volumeStatuses={relevantVolumeStatus}
            isReadOnly={isReadOnly}
            onOpenExercisePicker={onOpenExercisePicker}
            focusMuscleGroups={focusMuscleGroups}
            skipSubGroups={skipSubGroups}
            userExperience={userExperience}
          />
        );
      })}
    </div>
  );
};

export default WorkoutDaysList;
