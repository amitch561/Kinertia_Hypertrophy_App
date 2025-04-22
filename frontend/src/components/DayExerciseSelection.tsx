
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-container";
import SubGroupExerciseBlock from "./workout/subgroup-exercise-block";
import { getSubGroupsForMuscleGroup, getExercisesForSubGroup } from "@/lib/workout/exercises/exerciseUtils";
import type { Exercise, VolumeStatus } from "@/types/workout";

interface DayExerciseSelectionProps {
  day: string;
  splitLabel: string;
  muscleGroups: string[];
  exercises: Exercise[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
  isPushDaySequence?: number;
  volumeStatuses: VolumeStatus[];
  isReadOnly: boolean;
  onOpenExercisePicker?: (muscleGroup: string, subGroupName: string) => void;
  focusMuscleGroups?: string[];
  skipSubGroups?: Record<string, string[]>;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
}

const DayExerciseSelection = ({
  day,
  splitLabel,
  muscleGroups,
  exercises,
  selectedExercises,
  onExerciseToggle,
  isPushDaySequence,
  volumeStatuses,
  isReadOnly,
  onOpenExercisePicker,
  focusMuscleGroups = [],
  skipSubGroups = {},
  userExperience = 'beginner'
}: DayExerciseSelectionProps) => {
  const normalizeCase = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const debugBicepsExercises = () => {
    const bicepsExercises = exercises.filter(ex => ex.muscleGroup.toLowerCase() === 'biceps');
    console.log('All biceps exercises:', bicepsExercises);
    
    if (bicepsExercises.length > 0) {
      console.log('Biceps exercises subGroupIds:', bicepsExercises.map(ex => ({
        name: ex.name,
        subGroupId: ex.subGroupId,
        derivedSubgroup: getExercisesForSubGroup('Biceps', 'Long Head', [ex]).length > 0 ? 'Long Head' : 
                           getExercisesForSubGroup('Biceps', 'Short Head', [ex]).length > 0 ? 'Short Head' : 'Unknown'
      })));
    }
    console.log('Current user experience level:', userExperience);
  };

  React.useEffect(() => {
    if (muscleGroups.includes('biceps') || muscleGroups.includes('triceps')) {
      debugBicepsExercises();
    }
  }, [muscleGroups, exercises, userExperience]);

  // Debug function for legs
  const debugLegsSubgroups = (muscleGroup: string, subGroups: any[]) => {
    if (['quads', 'hamstrings', 'glutes'].includes(muscleGroup.toLowerCase())) {
      console.log(`${muscleGroup} subgroups:`, subGroups);
    }
  };

  return (
    <Card className="bg-neutral-light border-neutral rounded-xl mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-white">{`${day} – ${splitLabel}`}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2 py-2">
        <div className="space-y-3">
          {muscleGroups.map((muscleGroup) => {
            const normalizedMuscleGroup = normalizeCase(muscleGroup);
            const subGroups = getSubGroupsForMuscleGroup(
              normalizedMuscleGroup, 
              exercises,
              false,
              isPushDaySequence || 1,
              undefined,
              userExperience
            );

            // Debug log for legs subgroups
            debugLegsSubgroups(normalizedMuscleGroup, subGroups);
            
            const isFocus = focusMuscleGroups.includes(normalizedMuscleGroup);

            if (process.env.NODE_ENV === 'development') {
              console.log("🔍 Muscle Group:", normalizedMuscleGroup);
              console.log("   SubGroups returned:", subGroups?.map(sg => sg.name));
              console.log("   User Experience:", userExperience);
            }

            const volumeStatus = volumeStatuses.find(status => 
              normalizeCase(status.muscleGroup) === normalizedMuscleGroup
            );

            if (!subGroups || subGroups.length === 0) {
              return null;
            }

            return (
              <div key={muscleGroup} className="space-y-2">
                <h3 className="text-md font-semibold text-white pl-2">{normalizedMuscleGroup}</h3>
                {subGroups.map((subGroup, index) => {
                  // For leg muscles, ensure we're not showing "Primary" in the name
                  const displayName = ['Quads', 'Hamstrings', 'Glutes'].includes(normalizedMuscleGroup) 
                    ? normalizedMuscleGroup
                    : subGroup.name;
                  
                  if (!displayName || displayName.toLowerCase().includes("general")) {
                    return null;
                  }

                  const subGroupExercises = getExercisesForSubGroup(
                    normalizedMuscleGroup,
                    subGroup.name,
                    exercises
                  );
                  
                  const selectedExercise = exercises.find(ex =>
                    selectedExercises.includes(ex.id) && 
                    normalizeCase(ex.muscleGroup) === normalizedMuscleGroup && 
                    getExercisesForSubGroup(normalizedMuscleGroup, subGroup.name, [ex]).length > 0
                  );

                  if (process.env.NODE_ENV === 'development') {
                    console.log("🧩 SubGroup:", displayName);
                    console.log("   SubGroup skipped by skipSubGroups:", skipSubGroups[normalizedMuscleGroup]?.includes(displayName));
                    console.log("   SubGroupExercises found:", subGroupExercises.length);
                    console.log("   SelectedExercise:", selectedExercise?.name || "None");
                  }

                  if (skipSubGroups[normalizedMuscleGroup]?.includes(displayName)) {
                    return null;
                  }

                  return (
                    <SubGroupExerciseBlock
                      key={subGroup.id || `${muscleGroup}-${displayName}-${index}`}
                      subGroup={{
                        id: subGroup.id,
                        name: displayName,
                        exercises: subGroupExercises
                      }}
                      selectedExercise={selectedExercise}
                      isFocus={isFocus}
                      muscleGroup={normalizedMuscleGroup}
                      isReadOnly={isReadOnly}
                      isLast={index === subGroups.length - 1}
                      onExerciseChange={(exerciseId) => {
                        if (exerciseId) {
                          onExerciseToggle(exerciseId);
                        }
                      }}
                      onOpenExercisePicker={onOpenExercisePicker}
                      isPushDaySequence={isPushDaySequence || 0}
                      isSecondary={volumeStatus?.isSecondary}
                      skipSubGroups={skipSubGroups}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayExerciseSelection;
