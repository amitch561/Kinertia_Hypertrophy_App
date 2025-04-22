
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExerciseReplaceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (isPermanent: boolean) => void;
  exerciseName: string;
  replacementName: string;
}

const ExerciseReplaceDialog: React.FC<ExerciseReplaceDialogProps> = ({
  open,
  onClose,
  onConfirm,
  exerciseName,
  replacementName,
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#2A2A2A] border-[#454545] text-white">
        <DialogHeader>
          <DialogTitle>Replace Exercise</DialogTitle>
          <DialogDescription className="text-gray-400">
            Do you want to replace {exerciseName} with {replacementName} for just today, or for the entire training cycle?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onConfirm(false)}
            className="w-full sm:w-auto"
          >
            Just Today
          </Button>
          <Button 
            onClick={() => onConfirm(true)}
            className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#8a71f0]"
          >
            Entire Training Cycle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseReplaceDialog;
