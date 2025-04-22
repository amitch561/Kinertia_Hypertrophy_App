import { Badge } from "@/components/ui/badge";
import React from "react";
import { useWorkout } from "@/contexts/WorkoutContext";

const CurrentWorkoutCard = ({ workout, currentWeek, currentDay, onSelect, currentPhase }: any) => {
  const { exercises } = useWorkout();
  
  // Calculate exercises with working sets and total working sets
  const workingExercisesCount = workout?.exercises?.filter(ex => 
    ex.sets.some(set => !set.isWarmUp)
  ).length || 0;
  
  const workingSetsCount = workout?.exercises?.reduce((total, ex) => 
    total + (ex.sets?.filter(set => !set.isWarmUp)?.length || 0), 0
  ) || 0;
  
  // Find muscle groups targeted in the workout
  const muscleGroups = new Set<string>();
  if (workout?.exercises) {
    workout.exercises.forEach((ex: any) => {
      const exercise = exercises.find(e => e.id === ex.exerciseId);
      if (exercise?.muscleGroup) {
        muscleGroups.add(exercise.muscleGroup);
      }
    });
  }
  
  // Get the main focus muscle groups
  const focusGroups = Array.from(muscleGroups).slice(0, 3);
  
  return (
    <div
      className="bg-[#23292F] border border-[#434345] rounded-lg p-4 shadow-md cursor-pointer hover:bg-[#232943] transition-colors"
      onClick={() => onSelect(workout)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">{workout.name}</h3>
        <div className="flex gap-2">
          {focusGroups.map((group, i) => (
            <Badge key={i} variant="outline" className="capitalize text-xs">
              {group}
            </Badge>
          ))}
          {currentPhase && (
            <Badge 
              className="capitalize text-xs" 
              style={{ backgroundColor: `${currentPhase.color}30`, color: currentPhase.color, borderColor: currentPhase.color }}
            >
              {currentPhase.focusType}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-1 mb-3">
        <p className="text-gray-300 text-sm">
          {workingExercisesCount > 0 
            ? `${workingExercisesCount} exercises · ${workingSetsCount} working sets`
            : "No working sets planned"}
        </p>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-gray-400 text-xs">
          Week {currentWeek}, Day {currentDay}
        </span>
        <span className="text-primary text-sm font-medium">Start Workout →</span>
      </div>
    </div>
  );
};

export default CurrentWorkoutCard;
