
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkoutExercise, Exercise, Set } from "@/types/workout";
import ExerciseCard from "./workout-exercise-card";

interface WorkoutExerciseGroupsProps {
  groupedExercises: Record<string, { exercise: WorkoutExercise; details: Exercise }[]>;
  onExerciseSetUpdate: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  onAddSet: (exerciseIndex: number) => void;
  currentWorkout: {
    id: string;
    name: string;
    day: number;
    exercises: WorkoutExercise[];
  };
}

const WorkoutExerciseGroups = ({ 
  groupedExercises, 
  onExerciseSetUpdate, 
  onAddSet,
  currentWorkout,
}: WorkoutExerciseGroupsProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-6">
        {Object.entries(groupedExercises).length > 0 ? (
          Object.entries(groupedExercises).map(([muscleGroup, exercises]) => (
            <div key={muscleGroup} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {muscleGroup}
              </h3>
              <div className="space-y-4">
                {exercises.map(({ exercise, details }) => {
                  const exerciseIndex = currentWorkout.exercises ? 
                    currentWorkout.exercises.indexOf(exercise) : -1;
                  return (
                    <ExerciseCard
                      key={`${exercise.exerciseId}-${exerciseIndex}`}
                      exercise={exercise}
                      exerciseDetails={details}
                      exerciseIndex={exerciseIndex}
                      updateExerciseSet={onExerciseSetUpdate}
                      onAddSet={onAddSet}
                    />
                  );
                })}
              </div>
            </div>
          ))
        ) : null}
      </div>
    </ScrollArea>
  );
};

export default WorkoutExerciseGroups;
