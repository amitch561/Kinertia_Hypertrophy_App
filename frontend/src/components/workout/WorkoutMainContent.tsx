
import React, { useState } from "react";
import Header from "@/components/Header";
import WorkoutHeader from "@/components/workout/workout-header";
import WorkoutTabs from "@/components/workout/WorkoutTabs";
import DeloadWeekBanner from "@/components/workout/DeloadWeekBanner";
import StickyFooterCompleteButton from "@/components/workout/StickyFooterCompleteButton";
import { WorkoutFeedbackDialog } from "@/components/workout/workout-feedback-dialog";
import { useWorkoutPage } from "@/hooks/useWorkoutPage";
import { useProgressiveOverload } from "@/hooks/useProgressiveOverload";
import { useToast } from "@/hooks/use-toast";
import { useWorkout } from "@/contexts/WorkoutContext";
import { WorkoutExercise, Exercise, Set } from "@/types/workout";

interface WorkoutMainContentProps {
  currentWorkout: {
    id: string;
    name: string;
    day: number;
    exercises: WorkoutExercise[];
  };
  exercises: Exercise[];
}

const WorkoutMainContent: React.FC<WorkoutMainContentProps> = ({
  currentWorkout,
  exercises,
}) => {
  const { updateExerciseSet, completeWorkout, addWorkingSet } = useWorkout();

  const { 
    showFeedbackDialog, 
    setShowFeedbackDialog, 
    getExerciseDetails, 
    calculateCompletionPercentage, 
    isGroupCompleted 
  } = useWorkoutPage(currentWorkout, exercises);

  const {
    recoveryFeedback,
    updateRecoveryFeedback,
    isDeloadWeek,
  } = useProgressiveOverload();

  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>("workout");

  // Group exercises by muscle group
  const groupedExercises = currentWorkout.exercises
    ? currentWorkout.exercises.reduce((groups: Record<string, { exercise: WorkoutExercise; details: Exercise }[]>, exercise: WorkoutExercise) => {
        if (!exercise) return groups;
        const exerciseDetails = getExerciseDetails(exercise.exerciseId);
        if (!exerciseDetails) return groups;
        const muscleGroup = exerciseDetails.muscleGroup;
        if (!groups[muscleGroup]) {
          groups[muscleGroup] = [];
        }
        groups[muscleGroup].push({ exercise, details: exerciseDetails });
        return groups;
      }, {} as Record<string, { exercise: WorkoutExercise; details: Exercise }[]>)
    : {};

  const handleExerciseSetUpdate = (exerciseIndex: number, setIndex: number, data: Partial<Set>) => {
    // Check if this is a "skip" operation, and modify the data accordingly
    if (data && 'skip' in data && data.skip) {
      updateExerciseSet(exerciseIndex, setIndex, { completed: true, reps: 0, weight: 0 });
      return;
    }
    
    let patch = { ...data };
    if (typeof patch.weight === "string") patch.weight = parseFloat(patch.weight) || 0;
    if (typeof patch.reps === "string") patch.reps = parseInt(patch.reps) || 0;
    updateExerciseSet(exerciseIndex, setIndex, patch);

    const muscleGroups = Object.entries(groupedExercises);
    const groupIndex = muscleGroups.findIndex(([_, groupExercises]) =>
      groupExercises.some(({ exercise }) =>
        currentWorkout.exercises && currentWorkout.exercises.indexOf(exercise) === exerciseIndex,
      ),
    );

    if (groupIndex !== -1) {
      const groupExercises = muscleGroups[groupIndex][1];
      if (isGroupCompleted(groupExercises)) {
        setShowFeedbackDialog(true);
      }
    }
  };

  const handleAddWorkingSet = (exerciseIndex: number) => {
    addWorkingSet(exerciseIndex);
    toast({ title: "Added set", description: "New working set added." });
  };

  const handleFeedbackSelect = (feedback: "too_easy" | "just_right" | "too_hard") => {
    const success = completeWorkout(feedback);
    if (success) {
      setShowFeedbackDialog(false);
      // Back to dashboard - handled outside, see parent
      window.location.href = "/dashboard";
    }
  };

  const isAllSetsCompleted = () => {
    return currentWorkout.exercises.every((exercise: WorkoutExercise) => 
      exercise.sets.every((set) => set.completed)
    );
  };

  const uniqueMuscleGroups = Object.keys(groupedExercises);

  return (
    <main className="container max-w-2xl mx-auto px-4 py-6">
      <Header />
      <WorkoutHeader name={currentWorkout.name} day={currentWorkout.day} completionPercentage={calculateCompletionPercentage()} />

      {isDeloadWeek && <DeloadWeekBanner />}

      <WorkoutTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        groupedExercises={groupedExercises}
        onExerciseSetUpdate={handleExerciseSetUpdate}
        onAddSet={handleAddWorkingSet}
        currentWorkout={currentWorkout}
        exercises={exercises}
        uniqueMuscleGroups={uniqueMuscleGroups}
        recoveryFeedback={recoveryFeedback}
        updateRecoveryFeedback={updateRecoveryFeedback}
      />

      <StickyFooterCompleteButton
        onClick={() => setShowFeedbackDialog(true)}
        disabled={!isAllSetsCompleted()}
      />

      <WorkoutFeedbackDialog isOpen={showFeedbackDialog} onFeedbackSelect={handleFeedbackSelect} />
    </main>
  );
};

export default WorkoutMainContent;
