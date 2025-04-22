
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-container";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Exercise, WorkoutExercise, Set } from "@/types/workout";
import { Dumbbell, MoreHorizontal, Weight } from "lucide-react";
import { WarmUpSets } from "./workout/warm-up-sets";
import { WorkingSets } from "./workout/working-sets";
import { Toggle } from "@/components/ui/toggle-button";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from "@/components/ui/context-menu";
import { ExerciseReplaceDialog } from "./workout/exercise-replace-dialog";
import { JointPainReportDialog } from "./workout/JointPainReportDialog";
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
  
  // Get the working sets (last 2 sets)
  const workingSets = exercise.sets.slice(-2);
  const baseWeight = workingSets[0]?.weight || 0;

  const convertWeight = (weight: number, to: 'kg' | 'lbs') => {
    if (to === 'lbs') {
      return Math.round(weight * 2.20462);
    }
    return Math.round(weight / 2.20462);
  };

  const handleWeightUnitToggle = () => {
    setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
  };

  return (
    <Card className="bg-[#2A2A2A] border-[#454545] hover:border-[#565656] transition-colors mb-4">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Dumbbell className="h-5 w-5 text-[#9b87f5] mr-2" />
            <CardTitle className="text-lg">{exerciseDetails.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Toggle weight unit"
              pressed={weightUnit === 'lbs'}
              onPressedChange={handleWeightUnitToggle}
              className="bg-transparent border-[#454545] hover:bg-[#3A3A3A] hover:text-white data-[state=on]:bg-[#9b87f5] data-[state=on]:text-white"
            >
              <Weight className="h-4 w-4 mr-1" />
              {weightUnit.toUpperCase()}
            </Toggle>
            <Badge variant="outline" className="bg-transparent border-[#454545] text-gray-300">
              {exerciseDetails.muscleGroup}
            </Badge>
            
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-[#3A3A3A] focus:outline-none">
                  <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-[#2A2A2A] border-[#454545] text-white">
                <ContextMenuItem 
                  className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
                  onClick={() => setReplaceDialogOpen(true)}
                >
                  Replace Exercise
                </ContextMenuItem>
                <ContextMenuItem 
                  className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
                  onClick={() => setPainReportDialogOpen(true)}
                >
                  Report Joint Pain
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
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

export default WorkoutExerciseCard;
