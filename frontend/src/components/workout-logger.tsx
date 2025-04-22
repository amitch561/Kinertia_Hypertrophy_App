
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Exercise, WorkoutExercise, Set } from '@/types/workout';
import { Card, CardContent } from "@/components/ui/card-container";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Dumbbell } from 'lucide-react';
import WorkoutProgress from './workout-logger/WorkoutProgress';
import ExerciseSetsTable from './workout-logger/ExerciseSetsTable';
import ExerciseTips from './workout-logger/ExerciseTips';
import WorkoutFeedback from './workout-logger/WorkoutFeedback';

interface WorkoutLoggerProps {
  workout: {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
  };
  allExercises: Exercise[];
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ workout, allExercises }) => {
  const navigate = useNavigate();
  const { updateExerciseSet, completeWorkout } = useWorkout();
  const [expandedExercise, setExpandedExercise] = useState<number | null>(0);
  const [feedbackSelection, setFeedbackSelection] = useState<'too_easy' | 'just_right' | 'too_hard' | null>(null);
  
  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof Set, value: number | boolean) => {
    updateExerciseSet(exerciseIndex, setIndex, { [field]: value });
  };
  
  const toggleExpand = (index: number) => {
    setExpandedExercise(expandedExercise === index ? null : index);
  };
  
  const handleComplete = () => {
    completeWorkout(feedbackSelection || undefined);
    navigate('/calendar');
  };
  
  const getExerciseDetails = (exerciseId: string) => {
    return allExercises.find(ex => ex.id === exerciseId);
  };
  
  const calculateCompletionPercentage = () => {
    const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
    const completedSets = workout.exercises.reduce(
      (total, exercise) => total + exercise.sets.filter(set => set.completed).length, 
      0
    );
    return Math.round((completedSets / totalSets) * 100);
  };

  const isAllSetsCompleted = () => {
    return workout.exercises.every(exercise => 
      exercise.sets.every(set => set.completed)
    );
  };
  
  return (
    <div className="space-y-6">
      <WorkoutProgress 
        workoutName={workout.name}
        completionPercentage={calculateCompletionPercentage()}
      />

      <div className="space-y-4">
        {workout.exercises.map((exercise, exerciseIndex) => {
          const exerciseDetails = getExerciseDetails(exercise.exerciseId);
          if (!exerciseDetails) return null;
          
          return (
            <Card key={exerciseIndex} className="bg-[#2F2F2F] border-[#454545]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-white flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-[#E65A00]" />
                      {exerciseDetails.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {exerciseDetails.muscleGroup}
                      </Badge>
                    </h3>
                  </div>
                  <button 
                    onClick={() => toggleExpand(exerciseIndex)}
                    className="p-2 hover:bg-[#3A3A3A] rounded"
                  >
                    {expandedExercise === exerciseIndex ? "Hide" : "Show"}
                  </button>
                </div>
                
                {expandedExercise === exerciseIndex && (
                  <>
                    {exercise.sets.some(set => set.isWarmUp) && (
                      <Alert className="mb-4 bg-[#3F3F3F] border-[#454545]">
                        <Info className="h-4 w-4 text-gray-400" />
                        <AlertDescription className="text-gray-200">
                          Complete your warm-up sets before moving to working sets
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <ExerciseSetsTable
                      sets={exercise.sets}
                      exerciseIndex={exerciseIndex}
                      onSetChange={handleSetChange}
                    />
                    
                    <div className="mt-4">
                      <ExerciseTips
                        description={exerciseDetails.description}
                        tips={exerciseDetails.tips}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {isAllSetsCompleted() && (
        <WorkoutFeedback
          feedbackSelection={feedbackSelection}
          onFeedbackSelect={setFeedbackSelection}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default WorkoutLogger;
