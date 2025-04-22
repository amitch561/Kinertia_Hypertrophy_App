
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button-component";
import { Dumbbell, Timer } from "lucide-react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { Workout } from "@/types/workout";
import { getSplitDisplayName } from "@/utils/workoutDayUtils";

interface WorkoutCardProps {
  workout: Workout;
  onStart: () => void;
}

const WorkoutCard = ({ workout, onStart }: WorkoutCardProps) => {
  const { exercises } = useWorkout();

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise ? exercise.name : "Unknown Exercise";
  };

  // Calculate estimated workout duration (crude estimate)
  const estimatedDuration = Math.round(
    (workout.exercises.length * 3 +
      workout.exercises.reduce((total, ex) => total + ex.sets.length, 0) * 1)
  );

  // Improved primary muscle group calculation: count frequencies of muscle groups
  const groupCounts: { [group: string]: number } = {};
  workout.exercises.forEach(ex => {
    const found = exercises.find(e => e.id === ex.exerciseId);
    if (found && found.muscleGroup) {
      groupCounts[found.muscleGroup] = (groupCounts[found.muscleGroup] || 0) + 1;
    }
  });

  // Pick main focus muscle group if available
  const primaryMuscleGroup = Object.keys(groupCounts).length > 0
    ? Object.keys(groupCounts).reduce((a, b) => (groupCounts[a] > groupCounts[b] ? a : b), "")
    : "";

  const showMuscleLabel = primaryMuscleGroup && groupCounts[primaryMuscleGroup]! > 0;

  // Calculate working sets count (only count completed and working, not warmup sets)
  const workingSetsCount = workout.exercises.reduce((acc, ex) => {
    return acc + ex.sets.filter(set => !set.isWarmUp).length;
  }, 0);

  // ========== SPLIT or FOCUS DISPLAY ================
  // Try to infer which split this workout is from its name, fallback if needed
  let splitLabel = "";
  splitLabel = getSplitDisplayName(
    workout.name
      .toLowerCase()
      .replace(/ day| body| - day \d+/gi, "") // less noise in name
  );
  // Compose a more human label if possible: "Push Day", "Chest & Triceps", etc.
  let mainLabel = splitLabel;
  if (
    !mainLabel ||
    mainLabel === workout.name.toLowerCase() ||
    mainLabel === "Workout"
  ) {
    // If not a common split or display name, show primary muscle groups or fallback
    mainLabel = showMuscleLabel ? primaryMuscleGroup : workout.name;
  }
  // Secondary: show the workout number as a badge (if available)
  const workoutNumber = typeof workout.day === "number" ? workout.day : undefined;

  return (
    <Card className="exercise-card border-purple-100 hover:border-purple-200">
      <CardHeader className="pb-2">
        <div className="flex items-center mb-1">
          <Dumbbell className="h-5 w-5 mr-2 text-purple-400" />
          <span className="text-lg font-bold capitalize">{mainLabel}</span>
          {showMuscleLabel && mainLabel !== primaryMuscleGroup && (
            <span className="ml-2 px-2 py-0.5 rounded bg-purple-900/10 text-purple-300 text-xs font-semibold capitalize">
              {primaryMuscleGroup}
            </span>
          )}
          {splitLabel && mainLabel !== splitLabel && (
            <span className="ml-2 px-2 py-0.5 rounded bg-orange-900/40 text-orange-300 text-xs font-semibold capitalize border border-orange-500">
              {splitLabel}
            </span>
          )}
          {typeof workoutNumber !== "undefined" && (
            <span className="ml-3 text-xs bg-neutral-700 text-gray-400 px-2 py-0.5 rounded align-middle font-semibold">
              Workout {workoutNumber}
            </span>
          )}
        </div>
        {/* Optionally, smaller subtitle if the workout.name itself is not used as main heading */}
        {mainLabel !== workout.name && (
          <div className="text-xs text-gray-400 font-medium">{workout.name}</div>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Timer className="h-4 w-4 mr-1" />
          <span>~{estimatedDuration} mins</span>
        </div>
        <ul className="space-y-1 text-sm">
          {workout.exercises.slice(0, 4).map(exercise => (
            <li key={exercise.exerciseId} className="line-clamp-1">
              • {getExerciseName(exercise.exerciseId)}
            </li>
          ))}
          {workout.exercises.length > 4 && (
            <li className="text-gray-500">+ {workout.exercises.length - 4} more</li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1">
        <div className="text-sm text-gray-400 text-center">
          {workingSetsCount} working sets
        </div>
        <Button
          onClick={onStart}
          className="w-full gradient-bg hover:opacity-90"
        >
          Start Workout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;

