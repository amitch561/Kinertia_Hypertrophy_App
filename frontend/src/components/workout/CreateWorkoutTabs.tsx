
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import PlanTabContent from "@/components/workout/PlanTabContent";
import ExercisesTabContent from "@/components/workout/ExercisesTabContent";

type SplitType = "push_pull_legs" | "upper_lower" | "full_body" | "custom";
type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type VolumeLevel = "minimum" | "moderate" | "maximum";

interface CreateWorkoutTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  splitType: SplitType;
  onSplitTypeChange: (val: SplitType) => void;
  selectedDays: WeekDay[];
  onDaysChange: (days: WeekDay[]) => void;
  userAvailableDays: string[] | undefined;
  volumeLevel: VolumeLevel;
  onVolumeLevelChange: (val: VolumeLevel) => void;
  onContinue: () => void;
  currentPhase: any;
  muscleGroups: string[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
  isGeneratingPlan: boolean;
  onGeneratePlan: () => void;
  focusMuscleGroups?: string[];
  onFocusMuscleGroupsChange?: (groups: string[]) => void;
}

const CreateWorkoutTabs: React.FC<CreateWorkoutTabsProps> = ({
  selectedTab,
  setSelectedTab,
  splitType,
  onSplitTypeChange,
  selectedDays,
  onDaysChange,
  userAvailableDays,
  volumeLevel,
  onVolumeLevelChange,
  onContinue,
  currentPhase,
  muscleGroups,
  selectedExercises,
  onExerciseToggle,
  isGeneratingPlan,
  onGeneratePlan,
  focusMuscleGroups = [],
  onFocusMuscleGroupsChange,
}) => (
  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
    <TabsList className="grid grid-cols-2 bg-[#2F2F2F]">
      <TabsTrigger value="plan" className="data-[state=active]:bg-[#E65A00]">
        Plan Setup
      </TabsTrigger>
      <TabsTrigger value="exercises" className="data-[state=active]:bg-[#E65A00]">
        Exercise Selection
      </TabsTrigger>
    </TabsList>

    <TabsContent value="plan" className="mt-4">
      <PlanTabContent
        splitType={splitType}
        onSplitTypeChange={onSplitTypeChange}
        selectedDays={selectedDays}
        onDaysChange={onDaysChange}
        userAvailableDays={userAvailableDays}
        volumeLevel={volumeLevel}
        onVolumeLevelChange={onVolumeLevelChange}
        onContinue={onContinue}
        currentPhase={currentPhase}
        focusMuscleGroups={focusMuscleGroups}
        onFocusMuscleGroupsChange={onFocusMuscleGroupsChange}
      />
    </TabsContent>
    <TabsContent value="exercises" className="mt-4">
      <ExercisesTabContent
        muscleGroups={muscleGroups}
        selectedExercises={selectedExercises}
        onExerciseToggle={onExerciseToggle}
        splitType={splitType}
        selectedDays={selectedDays}
        isReadOnly={isGeneratingPlan}
        onGeneratePlan={onGeneratePlan}
        focusMuscleGroups={focusMuscleGroups}
        onFocusMuscleGroupsChange={onFocusMuscleGroupsChange}
        volumeLevel={volumeLevel}
      />
    </TabsContent>
  </Tabs>
);

export default CreateWorkoutTabs;
