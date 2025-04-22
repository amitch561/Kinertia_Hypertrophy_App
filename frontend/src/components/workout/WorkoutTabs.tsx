
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutExerciseGroups from "@/components/workout/workout-exercise-groups";
import NoExercisesMessage from "@/components/workout/no-exercises-message";
import RecoveryFeedbackTab from "./RecoveryFeedbackTab";
import { Exercise, WorkoutExercise, Set } from "@/types/workout";

interface WorkoutTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  groupedExercises: Record<string, { exercise: WorkoutExercise; details: Exercise }[]>;
  onExerciseSetUpdate: (exerciseIdx: number, setIdx: number, data: Partial<Set>) => void;
  onAddSet: (exerciseIndex: number) => void;
  currentWorkout: {
    id: string;
    name: string;
    day: number;
    exercises: WorkoutExercise[];
  };
  exercises: Exercise[];
  uniqueMuscleGroups: string[];
  recoveryFeedback: any[];
  updateRecoveryFeedback: (muscleGroup: string, metric: string, value: number) => void;
}

const WorkoutTabs = ({
  activeTab,
  setActiveTab,
  groupedExercises,
  onExerciseSetUpdate,
  onAddSet,
  currentWorkout,
  exercises,
  uniqueMuscleGroups,
  recoveryFeedback,
  updateRecoveryFeedback,
}: WorkoutTabsProps) => (
  <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="workout">Workout</TabsTrigger>
      <TabsTrigger value="feedback">Recovery Feedback</TabsTrigger>
    </TabsList>
    <TabsContent value="workout">
      {Object.keys(groupedExercises).length > 0 ? (
        <WorkoutExerciseGroups
          groupedExercises={groupedExercises}
          onExerciseSetUpdate={onExerciseSetUpdate}
          onAddSet={onAddSet}
          currentWorkout={currentWorkout}
        />
      ) : (
        <NoExercisesMessage exercises={exercises} currentWorkout={currentWorkout} />
      )}
    </TabsContent>
    <TabsContent value="feedback">
      <RecoveryFeedbackTab
        uniqueMuscleGroups={uniqueMuscleGroups}
        recoveryFeedback={recoveryFeedback}
        updateRecoveryFeedback={updateRecoveryFeedback}
      />
    </TabsContent>
  </Tabs>
);

export default WorkoutTabs;
