
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, ChevronRight, ChevronLeft } from "lucide-react";
import { TrainingFocusStep } from "@/components/onboarding/TrainingFocusStep";
import { ExperienceStep } from "@/components/onboarding/ExperienceStep";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";

type TrainingGoal = 'hypertrophy' | 'strength' | 'maintenance';
type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';

const Onboarding = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(3);

  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal>('hypertrophy');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [availableDays, setAvailableDays] = useState<number>(3);
  const [priorityMuscles, setPriorityMuscles] = useState<MuscleGroup[]>([]);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    () => {
      const userLocale = navigator.language;
      return ['en-US', 'en-GB', 'my'].includes(userLocale) ? 'lbs' : 'kg';
    }
  );

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (priorityMuscles.length === 0) {
        setPriorityMuscles(
          ['chest', 'back', 'legs', 'shoulders', 'arms', 'core']
        );
      }
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    if (user) {
      updateUserProfile({
        trainingGoal,
        experience,
        availableDays,
        priorityMuscles,
        equipment: ['dumbbell', 'barbell', 'bench', 'squat rack', 'cable machine', 'leg press machine', 'pull-up bar'],
        onboardingComplete: true,
        weightUnit
      });
      navigate('/create-workout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#1A1A1A] text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Dumbbell className="h-10 w-10 mx-auto mb-2 text-[#E65A00]" />
          <h1 className="text-2xl font-bold">Let's personalize your plan</h1>
          <p className="text-gray-400">Step {currentStep} of {totalSteps}</p>
          <Progress 
            value={(currentStep / totalSteps) * 100} 
            className="h-2 mt-4 bg-gray-800"
          />
        </div>
        
        <Card className="bg-[#2F2F2F] border-[#454545] text-white">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Design Your Training Focus"}
              {currentStep === 2 && "What's your experience level?"}
              {currentStep === 3 && "Setup Your Training Preferences"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {currentStep === 1 && "Let's customize your program focus and priority areas"}
              {currentStep === 2 && "This helps us tailor the workout complexity"}
              {currentStep === 3 && "Choose your preferred settings for tracking progress"}
            </CardDescription>
          </CardHeader>
          
          {currentStep === 1 && (
            <TrainingFocusStep
              trainingGoal={trainingGoal}
              setTrainingGoal={setTrainingGoal}
              experience={experience}
              priorityMuscles={priorityMuscles}
              setPriorityMuscles={setPriorityMuscles}
            />
          )}
          
          {currentStep === 2 && (
            <ExperienceStep
              experience={experience}
              setExperience={setExperience}
            />
          )}
          
          {currentStep === 3 && (
            <PreferencesStep
              availableDays={availableDays}
              setAvailableDays={setAvailableDays}
              weightUnit={weightUnit}
              setWeightUnit={setWeightUnit}
            />
          )}
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
              className="border-[#454545] text-white hover:bg-[#3A3A3A] hover:text-white"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={nextStep} 
              className="bg-[#E65A00] hover:bg-[#FF7A22]"
            >
              {currentStep === totalSteps ? "Complete" : "Continue"}
              {currentStep !== totalSteps && <ChevronRight className="ml-1 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
