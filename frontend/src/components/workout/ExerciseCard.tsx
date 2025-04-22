
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card-container";
import { Separator } from "@/components/ui/separator";
import { Exercise, WorkoutExercise, Set } from "@/types/workout";
import { WarmUpSets } from "./warm-up-sets";
import { WorkingSets } from "./working-sets";
import { ExerciseHeader } from "./ExerciseHeader";
import ExerciseCardMenu from "./ExerciseCardMenu";
import { ExerciseReplaceDialog } from "./exercise-replace-dialog";
import { JointPainReportDialog } from "./JointPainReportDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  exerciseDetails: Exercise;
  exerciseIndex: number;
  updateExerciseSet: (exerciseIndex: number, setIndex: number, data: Partial<Set>) => void;
  onAddSet: (exerciseIndex: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
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
  
  const workingSets = exercise.sets.slice(-2);
  const baseWeight = workingSets[0]?.weight || 0;

  const handleWeightUnitToggle = () => {
    setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
  };

  return (
    <Card className="bg-[#2A2A2A] border-[#454545] hover:border-[#565656] transition-colors mb-4">
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
          <Separator className="bg-[#454545]" />
          <WorkingSets
            sets={workingSets}
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

export default ExerciseCard;
