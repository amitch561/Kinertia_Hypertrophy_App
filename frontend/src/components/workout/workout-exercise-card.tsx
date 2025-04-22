
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card-container";
import { Separator } from "@/components/ui/separator";
import { Exercise, WorkoutExercise, Set } from "@/types/workout";
import { WarmUpSets } from "../workout/warm-up-sets";
import { WorkingSets } from "../workout/working-sets";
import { ExerciseHeader } from "../workout/ExerciseHeader";
import ExerciseCardMenu from "../workout/ExerciseCardMenu";
import { ExerciseReplaceDialog } from "../workout/exercise-replace-dialog";
import { JointPainReportDialog } from "../workout/JointPainReportDialog";
import { useAuth } from "@/contexts/AuthContext";

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseDetails: Exercise;
  exerciseIndex: number;
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  onAddSet: (exerciseIndex: number) => void;
}

const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  exercise,
  exerciseDetails,
  exerciseIndex,
  updateExerciseSet,
  onAddSet,
}) => {
  const { user } = useAuth();
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(user?.weightUnit || 'kg');
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [painReportDialogOpen, setPainReportDialogOpen] = useState(false);
  
  // Calculate working sets - ensure we don't include warm-up sets in the volume count
  const workingSets = exercise.sets.filter(set => !set.isWarmUp);
  // If there are no working sets, add at least 2 (this helps with initialization)
  const setsToDisplay = workingSets.length > 0 ? workingSets : [
    { id: `new-set-1-${exerciseIndex}`, weight: 0, reps: 0, completed: false },
    { id: `new-set-2-${exerciseIndex}`, weight: 0, reps: 0, completed: false }
  ];
  const baseWeight = setsToDisplay[0]?.weight || 0;

  const handleWeightUnitToggle = () => {
    setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
  };

  return (
    <Card className="bg-neutral-light border-neutral hover:border-neutral-light transition-colors mb-4 rounded-xl">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <ExerciseHeader
            exerciseDetails={exerciseDetails}
            weightUnit={weightUnit}
            onWeightUnitToggle={handleWeightUnitToggle}
          />
          <ExerciseCardMenu
            onReplaceClick={() => setReplaceDialogOpen(true)}
            onPainReportClick={() => setPainReportDialogOpen(true)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <WarmUpSets 
            baseWeight={baseWeight}
            previousPerformance={exercise.previousPerformance}
            weightUnit={weightUnit}
          />
          <Separator className="bg-neutral" />
          <WorkingSets
            sets={setsToDisplay}
            exerciseIndex={exerciseIndex}
            updateExerciseSet={updateExerciseSet}
            weightUnit={weightUnit}
            onAddSet={onAddSet}
          />
        </div>
      </CardContent>

      <ExerciseReplaceDialog 
        open={replaceDialogOpen}
        onOpenChange={setReplaceDialogOpen}
        exerciseId={exercise.exerciseId}
        exerciseIndex={exerciseIndex}
        muscleGroup={exerciseDetails.muscleGroup}
      />

      <JointPainReportDialog
        open={painReportDialogOpen}
        onOpenChange={setPainReportDialogOpen}
        exerciseId={exercise.exerciseId}
        exerciseName={exerciseDetails.name}
        exerciseIndex={exerciseIndex}
      />
    </Card>
  );
};

export default WorkoutExerciseCard;
