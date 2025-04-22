
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Info, TrendingUp, Target, History } from "lucide-react";
import { Button } from "@/components/ui/button-component";
import { Badge } from "@/components/ui/badge";
import { volumeLandmarks } from "@/lib/workout/generator/volumeLandmarks";
import { undertrainedSubGroups } from "@/lib/workout/exercises/secondaryMuscleMap";
import { useWorkout } from "@/contexts/WorkoutContext";
import UndertrainedSubgroupAlert from "./UndertrainedSubgroupAlert";

interface VolumeRecommendationsInfoProps {
  experience: string;
  focusMuscleGroups?: string[];
}

const VolumeRecommendationsInfo: React.FC<VolumeRecommendationsInfoProps> = ({
  experience = "beginner",
  focusMuscleGroups = []
}) => {
  const { subgroupHistory } = useWorkout();
  const expLevel = experience as 'beginner' | 'intermediate' | 'advanced';
  
  // Format muscle group names for display
  const formatMuscleGroup = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
  // Get appropriate priority muscle bonus based on experience
  const getPriorityBonus = () => {
    if (expLevel === 'beginner') return 2;
    if (expLevel === 'intermediate') return 3;
    return 4;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          Volume Guide
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto bg-[#1A1F2C] text-white border-neutral">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evidence-Based Volume Guidelines
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-6">
          <p className="text-sm text-gray-300">
            These research-backed recommendations show optimal weekly sets per muscle group for your experience level ({expLevel}).
            Training volume is one of the primary drivers of muscle hypertrophy.
          </p>
          
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-green-500/20 border-green-500">MEV</Badge>
              <span>Minimum Effective Volume - The lowest number of sets per week to see growth</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-blue-500/20 border-blue-500">Moderate</Badge>
              <span>Optimal Volume - A balanced approach for most lifters</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-orange-500/20 border-orange-500">MRV</Badge>
              <span>Maximum Recoverable Volume - Upper limit before recovery issues</span>
            </div>
          </div>
          
          <UndertrainedSubgroupAlert />
          
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <History className="h-4 w-4 text-amber-500" />
              Commonly Undertrained Muscle Sub-Groups
            </h3>
            <p className="text-sm text-gray-300">
              Based on EMG studies and training program analysis, these muscle sub-groups often receive insufficient volume in typical training programs.
            </p>
            <div className="border border-gray-800 rounded-md overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-[#2A2A2A]">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                      Sub-Group
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                      Common Issue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {Object.entries(undertrainedSubGroups)
                    .sort(([_idA, dataA], [_idB, dataB]) => dataB.priority - dataA.priority)
                    .map(([id, data]) => (
                      <tr key={id}>
                        <td className="px-3 py-2">{data.name}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <div className="bg-amber-500/30 h-2 rounded-full" style={{ width: `${data.priority * 4}px` }}></div>
                            <span className="text-xs text-gray-400">{data.priority}/10</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-300">{data.description}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400">
              This table is derived from multiple EMG studies and analysis of common training programs. 
              The app automatically tracks your training by sub-group and prioritizes those that have received 
              inadequate volume for 3+ consecutive weeks.
            </p>
          </div>
          
          {focusMuscleGroups.length > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="font-medium">Focus Muscle Groups</h3>
              </div>
              <p className="text-sm text-gray-300">
                Your selected focus muscles receive +{getPriorityBonus()} sets in volume targets to prioritize their development.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {focusMuscleGroups.map(muscle => (
                  <Badge key={muscle} className="bg-primary/20 border-primary">
                    {formatMuscleGroup(muscle)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="border border-gray-800 rounded-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-[#2A2A2A]">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                    Muscle Group
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                    MEV
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                    Moderate
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-800">
                    MRV
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {Object.entries(volumeLandmarks).map(([muscleGroup, volumes]) => {
                  const isFocusMuscle = focusMuscleGroups.includes(muscleGroup);
                  const priorityBonus = isFocusMuscle ? getPriorityBonus() : 0;
                  
                  return (
                    <tr key={muscleGroup} className={isFocusMuscle ? "bg-primary/5" : ""}>
                      <td className="px-3 py-2 text-sm flex items-center gap-1">
                        {isFocusMuscle && <Target className="h-3.5 w-3.5 text-primary" />}
                        {formatMuscleGroup(muscleGroup)}
                      </td>
                      <td className="px-3 py-2 text-sm text-center">
                        {volumes[expLevel].minimum}
                        {isFocusMuscle && <span className="text-primary"> (+{priorityBonus})</span>}
                      </td>
                      <td className="px-3 py-2 text-sm text-center">
                        {volumes[expLevel].moderate}
                        {isFocusMuscle && <span className="text-primary"> (+{priorityBonus})</span>}
                      </td>
                      <td className="px-3 py-2 text-sm text-center">
                        {volumes[expLevel].maximum}
                        {isFocusMuscle && <span className="text-primary"> (+{priorityBonus})</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Optimal Frequency</h3>
            <p className="text-sm text-gray-300">
              Research shows spreading volume across multiple sessions per week is more effective than doing all sets in one workout.
            </p>
            <div className="space-y-1 text-xs text-gray-400">
              <div>• Beginners: 2-3x per muscle group weekly</div>
              <div>• Intermediate: 2x per muscle group weekly</div>
              <div>• Advanced: 1-2x per muscle group weekly (with more volume per session)</div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 pt-2">
            Based on research from Schoenfeld et al., Brad Schoenfeld, James Krieger, Renaissance Periodization, and other evidence-based sources.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default VolumeRecommendationsInfo;
