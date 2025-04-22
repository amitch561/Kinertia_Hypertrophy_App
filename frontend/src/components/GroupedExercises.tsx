import React from "react";
import { Exercise, WorkoutExercise } from "@/types/workout";
import WorkoutExerciseCard from "./workout/workout-exercise-card";

interface GroupedExercisesProps {
  exercises: WorkoutExercise[];
  allExercises: Exercise[];
  exerciseIndex: number;
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<{
    weight: number;
    reps: number;
    completed: boolean;
    rpe?: number;
  }>) => void;
  onAddSet: (exerciseIndex: number) => void;
}

const GroupedExercises: React.FC<GroupedExercisesProps> = ({
  exercises,
  allExercises,
  exerciseIndex,
  updateExerciseSet,
  onAddSet,
}) => {
  // Group exercises by muscle group
  const groupedExercises = exercises.reduce((groups, exercise) => {
    const exerciseDetails = allExercises.find(e => e.id === exercise.exerciseId);
    if (!exerciseDetails) return groups;
    
    const muscleGroup = exerciseDetails.muscleGroup;
    if (!groups[muscleGroup]) {
      groups[muscleGroup] = [];
    }
    groups[muscleGroup].push({ exercise, details: exerciseDetails });
    return groups;
  }, {} as Record<string, { exercise: WorkoutExercise; details: Exercise }[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedExercises).map(([muscleGroup, exercises], groupIndex) => (
        <div key={muscleGroup} className="space-y-4">
          <h3 className="text-lg font-semibold capitalize text-white">
            {muscleGroup}
          </h3>
          <div className="space-y-4 pl-4 border-l border-[#454545]">
            {exercises.map(({ exercise, details }, idx) => (
              <WorkoutExerciseCard
                key={exercise.exerciseId}
                exercise={exercise}
                exerciseDetails={details}
                exerciseIndex={exerciseIndex + idx}
                updateExerciseSet={updateExerciseSet}
                onAddSet={onAddSet}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupedExercises;
