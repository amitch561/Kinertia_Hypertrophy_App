
import React, { useState, useEffect } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { Exercise } from "@/types/workout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dumbbell } from "lucide-react";

interface ExerciseReplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
  exerciseIndex: number;
  muscleGroup: string;
}

export function ExerciseReplaceDialog({
  open,
  onOpenChange,
  exerciseId,
  exerciseIndex,
  muscleGroup,
}: ExerciseReplaceDialogProps) {
  const { exercises, replaceExercise } = useWorkout();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [replacementMode, setReplacementMode] = useState<"today" | "all">("today");
  
  // Filter exercises from the same muscle group as replacement options
  const replacementOptions = exercises.filter(
    ex => ex.muscleGroup === muscleGroup && ex.id !== exerciseId
  );
  
  // Reset selected exercise when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedExerciseId(null);
      setReplacementMode("today");
    }
  }, [open]);
  
  const handleReplace = () => {
    if (!selectedExerciseId) return;
    
    replaceExercise(
      exerciseIndex,
      selectedExerciseId,
      replacementMode === "all"
    );
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2A2A2A] border-[#454545] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Replace Exercise</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a replacement exercise from the same muscle group
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <ScrollArea className="h-[300px] pr-4">
            <RadioGroup value={selectedExerciseId || ""} onValueChange={setSelectedExerciseId}>
              {replacementOptions.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-start space-x-4 mb-4 border-b border-[#454545] pb-3 last:border-0"
                >
                  <RadioGroupItem 
                    value={exercise.id} 
                    id={exercise.id}
                    className="mt-1 border-[#454545] data-[state=checked]:border-[#9b87f5] data-[state=checked]:bg-[#9b87f5]" 
                  />
                  <Label 
                    htmlFor={exercise.id} 
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 text-[#9b87f5] mr-2" />
                      <span className="text-white font-medium">{exercise.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">{exercise.description}</p>
                  </Label>
                </div>
              ))}
              
              {replacementOptions.length === 0 && (
                <div className="text-center p-4 text-gray-400">
                  No alternative exercises found for this muscle group
                </div>
              )}
            </RadioGroup>
          </ScrollArea>
          
          <div className="flex flex-col gap-4 mt-2">
            <div className="text-sm font-medium text-white mb-1">Replacement Options:</div>
            <RadioGroup 
              value={replacementMode} 
              onValueChange={(value) => setReplacementMode(value as "today" | "all")}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="today" 
                  id="today"
                  className="border-[#454545] data-[state=checked]:border-[#9b87f5] data-[state=checked]:bg-[#9b87f5]" 
                />
                <Label htmlFor="today" className="cursor-pointer">For Today Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="all" 
                  id="all" 
                  className="border-[#454545] data-[state=checked]:border-[#9b87f5] data-[state=checked]:bg-[#9b87f5]"
                />
                <Label htmlFor="all" className="cursor-pointer">For Entire Program</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            className="w-full sm:w-auto border-[#454545] text-white hover:bg-[#3A3A3A] hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleReplace} 
            className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={!selectedExerciseId}
          >
            Replace Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
