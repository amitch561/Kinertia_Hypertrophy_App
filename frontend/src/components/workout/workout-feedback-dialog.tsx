
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button-component";
import { ThumbsUp, Check, ThumbsDown } from "lucide-react";

interface WorkoutFeedbackDialogProps {
  isOpen: boolean;
  onFeedbackSelect: (feedback: 'too_easy' | 'just_right' | 'too_hard') => void;
}

export const WorkoutFeedbackDialog: React.FC<WorkoutFeedbackDialogProps> = ({
  isOpen,
  onFeedbackSelect,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-neutral border-neutral-light rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-white">How was your workout?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Your feedback helps us adjust your future workouts
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-12 border-neutral-light hover:bg-neutral-light hover:text-white"
            onClick={() => onFeedbackSelect('too_easy')}
          >
            <ThumbsUp className="h-5 w-5" />
            Too Easy
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-12 border-neutral-light hover:bg-neutral-light hover:text-white"
            onClick={() => onFeedbackSelect('just_right')}
          >
            <Check className="h-5 w-5" />
            Just Right
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 h-12 border-neutral-light hover:bg-neutral-light hover:text-white"
            onClick={() => onFeedbackSelect('too_hard')}
          >
            <ThumbsDown className="h-5 w-5" />
            Too Hard
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
