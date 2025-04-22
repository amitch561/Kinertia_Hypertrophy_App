import { Target, Info, AlertCircle, Dumbbell, Weight } from 'lucide-react';
import { CardContent } from "@/components/ui/card-container";
import { Checkbox } from "@/components/ui/checkbox-input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip-popup";

type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
type TrainingGoal = 'hypertrophy' | 'strength' | 'maintenance';

interface TrainingFocusStepProps {
  trainingGoal: TrainingGoal;
  setTrainingGoal: (goal: TrainingGoal) => void;
  experience: 'beginner' | 'intermediate' | 'advanced';
  priorityMuscles: MuscleGroup[];
  setPriorityMuscles: React.Dispatch<React.SetStateAction<MuscleGroup[]>>;
}

const muscleGroupOptions = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' }
] as const;

export const TrainingFocusStep = ({
  trainingGoal,
  setTrainingGoal,
  experience,
  priorityMuscles,
  setPriorityMuscles
}: TrainingFocusStepProps) => {
  const isBeginnerExperience = experience === 'beginner';

  const handleMuscleGroupToggle = (muscle: MuscleGroup) => {
    setPriorityMuscles(prev => {
      if (prev.includes(muscle)) {
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== muscle);
      }
      return [...prev, muscle];
    });
  };

  return (
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Select Your Training Goal</h3>
          <div className="grid grid-cols-1 gap-4">
            <div 
              className={`p-4 rounded-lg border-2 flex items-center cursor-pointer ${
                trainingGoal === 'hypertrophy' ? 'border-[#E65A00] bg-[#E65A00]/10' : 'border-[#454545]'
              }`}
              onClick={() => setTrainingGoal('hypertrophy')}
            >
              <Target className="h-5 w-5 mr-3" />
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">Hypertrophy</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] bg-[#2A2A2A] text-white border-[#454545]">
                      <div className="space-y-2">
                        <p>Build muscle size using moderate weight, higher reps (8–15), and progressive overload.</p>
                        {isBeginnerExperience && (
                          <p className="text-[#E65A00]">✨ Recommended for beginners</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-gray-400">Ideal for most beginners and intermediates</p>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border-2 flex items-center cursor-pointer ${
                trainingGoal === 'strength' ? 'border-[#E65A00] bg-[#E65A00]/10' : 'border-[#454545]'
              }`}
              onClick={() => setTrainingGoal('strength')}
            >
              <Dumbbell className="h-5 w-5 mr-3" />
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">Strength</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] bg-[#2A2A2A] text-white border-[#454545]">
                      <div className="space-y-2">
                        <p>Focus on building max strength using lower reps (3–6) and heavier loads.</p>
                        {isBeginnerExperience && (
                          <p className="text-yellow-500">Consider starting with Hypertrophy to build a foundation first.</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-gray-400">Best for experienced lifters or performance goals</p>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border-2 flex items-center cursor-pointer 
                ${trainingGoal === 'maintenance' ? 'border-[#E65A00] bg-[#E65A00]/10' : 'border-[#454545]'}
                ${isBeginnerExperience ? 'opacity-50' : ''}`}
              onClick={() => {
                if (!isBeginnerExperience) {
                  setTrainingGoal('maintenance');
                }
              }}
            >
              <Weight className="h-5 w-5 mr-3" />
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">Maintenance</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] bg-[#2A2A2A] text-white border-[#454545]">
                      <div className="space-y-2">
                        <p>Maintain current muscle size and fitness with balanced effort and stable volume.</p>
                        {isBeginnerExperience && (
                          <p className="text-red-500">
                            <AlertCircle className="inline-block mr-1 h-4 w-4" />
                            Not recommended for beginners. Start with Hypertrophy to build a strong foundation.
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-gray-400">
                  {isBeginnerExperience 
                    ? "Recommended only for experienced users"
                    : "For experienced users coming off a build or cut cycle"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#454545] my-6" />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-medium">Priority Muscle Groups</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] bg-[#2A2A2A] text-white border-[#454545]">
                  Your plan will train all major muscle groups. Selected priority muscles will receive more volume and frequency to support focused growth.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {muscleGroupOptions.map((muscle) => (
              <div
                key={muscle.id}
                className={`p-3 rounded-lg border flex items-center cursor-pointer transition-colors duration-200 ${
                  priorityMuscles.includes(muscle.id as MuscleGroup) 
                    ? 'border-[#E65A00] bg-[#E65A00]/10' 
                    : 'border-[#454545] hover:border-[#E65A00]/50'
                }`}
                onClick={() => handleMuscleGroupToggle(muscle.id as MuscleGroup)}
              >
                <Checkbox 
                  id={`muscle-${muscle.id}`}
                  checked={priorityMuscles.includes(muscle.id as MuscleGroup)}
                  onCheckedChange={() => handleMuscleGroupToggle(muscle.id as MuscleGroup)}
                  className="mr-2 border-[#6A7295] data-[state=checked]:bg-[#E65A00]"
                />
                <label htmlFor={`muscle-${muscle.id}`} className="cursor-pointer">
                  {muscle.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  );
};
