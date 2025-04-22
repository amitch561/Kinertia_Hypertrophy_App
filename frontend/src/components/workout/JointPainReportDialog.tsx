
import React, { useState } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button-component";
import { Checkbox } from "@/components/ui/checkbox-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { useAuth } from "@/contexts/AuthContext";

const JOINT_OPTIONS = [
  "Shoulder",
  "Elbow",
  "Wrist",
  "Hip",
  "Knee",
  "Ankle",
  "Lower Back",
  "Neck",
  "Other"
];

interface JointPainReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
  exerciseName: string;
  exerciseIndex: number;
}

export function JointPainReportDialog({
  open,
  onOpenChange,
  exerciseId,
  exerciseName,
  exerciseIndex,
}: JointPainReportDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { replaceExercise } = useWorkout();
  
  const [selectedJoints, setSelectedJoints] = useState<string[]>([]);
  const [painNotes, setPainNotes] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleJointToggle = (joint: string) => {
    setSelectedJoints(prev => 
      prev.includes(joint)
        ? prev.filter(j => j !== joint)
        : [...prev, joint]
    );
  };
  
  const handleSubmit = () => {
    if (selectedJoints.length === 0) {
      toast({
        title: "Please select at least one joint",
        description: "Indicate which joint(s) are experiencing pain",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would save this pain report to the user's workout history
    // For now, we'll just show a toast and open the confirmation dialog
    const timestamp = new Date().toISOString();
    const painReport = {
      userId: user?.id,
      exerciseId,
      exerciseName,
      timestamp,
      joints: selectedJoints,
      notes: painNotes,
    };
    
    // Log the pain report (in a real app, this would be saved to a database)
    console.log("Pain report submitted:", painReport);
    
    // Store in localStorage for future reference
    const storageKey = `painReports-${user?.id}`;
    const existingReports = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([...existingReports, painReport]));
    
    toast({
      title: "Pain report submitted",
      description: "Your report has been saved for future program adjustments",
    });
    
    // Ask if user wants to replace the exercise
    setConfirmDialogOpen(true);
  };
  
  const handleReplaceConfirm = (shouldReplace: boolean) => {
    setConfirmDialogOpen(false);
    
    if (shouldReplace) {
      // Close current dialog and open the replacement dialog
      onOpenChange(false);
      
      // We need to wait for the current dialog to close before triggering the exercise replace UI
      setTimeout(() => {
        const replaceEvent = new CustomEvent("trigger-exercise-replace", {
          detail: { exerciseIndex }
        });
        document.dispatchEvent(replaceEvent);
      }, 300);
    } else {
      // Just close the dialog
      onOpenChange(false);
      
      // Reset form state
      setSelectedJoints([]);
      setPainNotes("");
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#2A2A2A] border-[#454545] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Joint Pain</DialogTitle>
            <DialogDescription className="text-gray-400">
              {exerciseName} is causing discomfort? Let us know which joints are affected.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Affected Joint(s)</h3>
              <div className="grid grid-cols-2 gap-2">
                {JOINT_OPTIONS.map((joint) => (
                  <div key={joint} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`joint-${joint}`} 
                      checked={selectedJoints.includes(joint)} 
                      onCheckedChange={() => handleJointToggle(joint)}
                      className="border-[#454545] data-[state=checked]:bg-[#9b87f5]"
                    />
                    <Label 
                      htmlFor={`joint-${joint}`}
                      className="text-sm cursor-pointer"
                    >
                      {joint}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pain-notes">Pain Description</Label>
              <Textarea
                id="pain-notes"
                placeholder="Describe the pain or discomfort (sharp, dull, during which part of movement, etc.)"
                value={painNotes}
                onChange={(e) => setPainNotes(e.target.value)}
                className="bg-[#1A1A1A] border-[#454545] resize-none h-20 text-white"
              />
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
              onClick={handleSubmit} 
              className="w-full sm:w-auto bg-[#9b87f5] hover:bg-[#7E69AB]"
              disabled={selectedJoints.length === 0}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={confirmDialogOpen}>
        <AlertDialogContent className="bg-[#2A2A2A] border-[#454545] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Would you like to swap this exercise now?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              We can help you find an alternative exercise that may be more comfortable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => handleReplaceConfirm(false)}
              className="border-[#454545] bg-transparent text-white hover:bg-[#3A3A3A]"
            >
              No, Continue Workout
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleReplaceConfirm(true)}
              className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            >
              Yes, Replace Exercise
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
