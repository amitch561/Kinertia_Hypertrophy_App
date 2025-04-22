
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card-container";
import CurrentPhaseBanner from "@/components/workout/CurrentPhaseBanner";
import NoPlanBox from "@/components/workout/NoPlanBox";
import CreateWorkoutTabs from "@/components/workout/CreateWorkoutTabs";
import VolumeRecommendationsInfo from "@/components/workout/VolumeRecommendationsInfo";

type SplitType = "push_pull_legs" | "upper_lower" | "full_body" | "custom";
type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type VolumeLevel = "minimum" | "moderate" | "maximum";

const splitTypeData = {
  push_pull_legs: {
    label: "Push/Pull/Legs",
    description: "Split targeting pushing, pulling, and leg movements",
    muscleGroups: {
      push: ["chest", "shoulders", "triceps"],
      pull: ["back", "biceps"],
      legs: ["quads", "hamstrings", "glutes", "calves"],
    },
  },
  upper_lower: {
    label: "Upper/Lower",
    description: "Split between upper and lower body workouts",
    muscleGroups: {
      upper: ["chest", "back", "shoulders", "biceps", "triceps"],
      lower: ["quads", "hamstrings", "glutes", "calves"],
    },
  },
  full_body: {
    label: "Full Body",
    description: "Complete body workout in each session",
    muscleGroups: {
      full: ["chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "calves"],
    },
  },
  custom: {
    label: "Custom",
    description: "Personalized split based on your preferences",
    muscleGroups: {},
  },
} as const;

const CreateWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { exercises, workoutPlan, generateNewWorkoutPlan, macroCyclePlan, currentPhase } = useWorkout();
  
  const [selectedTab, setSelectedTab] = useState("plan");
  const [splitType, setSplitType] = useState<SplitType>("push_pull_legs");
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [volumeLevel, setVolumeLevel] = useState<VolumeLevel>("moderate");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [focusMuscleGroups, setFocusMuscleGroups] = useState<string[]>(
    location.state?.focusMuscleGroups || []
  );

  useEffect(() => {
    if (!user?.onboardingComplete) {
      setSelectedTab("plan");
    }
    
    if (currentPhase?.focusType) {
      const volumeMap = {
        'hypertrophy': 'moderate' as VolumeLevel,
        'strength': 'maximum' as VolumeLevel,
        'peaking': 'maximum' as VolumeLevel,
        'recovery': 'minimum' as VolumeLevel
      };
      setVolumeLevel(volumeMap[currentPhase.focusType as keyof typeof volumeMap] || 'moderate');
    }
  }, [user, currentPhase]);

  const handleSplitTypeChange = (value: SplitType) => {
    setSplitType(value);
  };

  const handleVolumeLevelChange = (value: VolumeLevel) => {
    setVolumeLevel(value);
  };

  const handleDaysChange = (days: WeekDay[]) => {
    setSelectedDays(days);
    
    if (days.length >= 5) {
      setSplitType('push_pull_legs');
    } else if (days.length === 4) {
      setSplitType('upper_lower');
    } else if (days.length <= 3) {
      setSplitType('full_body');
    }
  };

  const getCurrentMuscleGroups = () => {
    const split = splitTypeData[splitType];
    return Object.values(split.muscleGroups).flat();
  };

  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleCreatePlan = () => {
    navigate("/create-plan");
  };

  const handleFocusMuscleGroupsChange = (groups: string[]) => {
    console.log("Focus muscle groups changed:", groups);
    setFocusMuscleGroups(groups);
  };

  const handleGeneratePlan = () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Please select training days",
        description: "Choose at least one day to create your workout plan.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPlan(true);
    
    // Ensure working sets are created for each exercise when the plan is generated
    generateNewWorkoutPlan(
      volumeLevel,
      selectedExercises.length > 0 ? selectedExercises : [],
      currentPhase?.focusType,
      focusMuscleGroups
    );
    
    navigate("/dashboard");
  };

  const handleContinueToExercises = () => {
    setSelectedTab("exercises");
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white pb-20">
      <Header />
      <div className="container mx-auto p-4">
        {macroCyclePlan && currentPhase && (
          <CurrentPhaseBanner currentPhase={currentPhase} volumeLevel={volumeLevel} />
        )}

        {!macroCyclePlan && (
          <NoPlanBox onCreatePlan={handleCreatePlan} />
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Create Workout Plan</h1>
          <VolumeRecommendationsInfo 
            experience={user?.experience || 'beginner'} 
            focusMuscleGroups={focusMuscleGroups}
          />
        </div>

        <Card className="p-4 bg-[#1E2332] border-0 shadow-md">
          <CreateWorkoutTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            splitType={splitType}
            onSplitTypeChange={handleSplitTypeChange}
            selectedDays={selectedDays}
            onDaysChange={handleDaysChange}
            userAvailableDays={Array.isArray(user?.availableDays) ? user?.availableDays : []}
            volumeLevel={volumeLevel}
            onVolumeLevelChange={handleVolumeLevelChange}
            onContinue={handleContinueToExercises}
            currentPhase={currentPhase}
            muscleGroups={getCurrentMuscleGroups()}
            selectedExercises={selectedExercises}
            onExerciseToggle={handleExerciseToggle}
            isGeneratingPlan={isGeneratingPlan}
            onGeneratePlan={handleGeneratePlan}
            focusMuscleGroups={focusMuscleGroups}
            onFocusMuscleGroupsChange={handleFocusMuscleGroupsChange}
          />
        </Card>
      </div>
    </div>
  );
};

export default CreateWorkout;
