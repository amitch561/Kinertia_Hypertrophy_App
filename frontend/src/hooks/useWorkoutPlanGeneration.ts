
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { generateWorkoutPlan, volumeLandmarks } from '@/lib/workoutGeneratorExtended';
import type { Exercise } from '@/types/workout';
import { useState, useEffect } from 'react';

export interface RecoveryFeedback {
  muscleGroup: string;
  rir: number;
  pump: number;
  soreness: number;
  fatigue: number;
}

export const useWorkoutPlanGeneration = (
  exercises: Exercise[],
  setWorkoutPlan: (plan: any[]) => void,
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [recoveryFeedback, setRecoveryFeedback] = useState<RecoveryFeedback[]>([]);

  // Load current week from localStorage
  useEffect(() => {
    if (user?.id) {
      const savedWeek = localStorage.getItem(`currentWeek-${user.id}`);
      if (savedWeek) {
        setCurrentWeek(parseInt(savedWeek));
      }
      
      const savedFeedback = localStorage.getItem(`recoveryFeedback-${user.id}`);
      if (savedFeedback) {
        setRecoveryFeedback(JSON.parse(savedFeedback));
      }
    }
  }, [user]);

  // Save current week when it changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`currentWeek-${user.id}`, currentWeek.toString());
    }
  }, [currentWeek, user]);

  // Save recovery feedback when it changes
  useEffect(() => {
    if (user?.id && recoveryFeedback.length > 0) {
      localStorage.setItem(`recoveryFeedback-${user.id}`, JSON.stringify(recoveryFeedback));
    }
  }, [recoveryFeedback, user]);

  // Calculate recovery scores from feedback
  const calculateRecoveryScores = () => {
    return recoveryFeedback.map(feedback => {
      // Formula: (pump + (6-soreness) + (6-fatigue)) / 3
      const pumpScore = feedback.pump;
      const sorenessScore = 6 - feedback.soreness;
      const fatigueScore = 6 - feedback.fatigue;
      const recoveryScore = (pumpScore + sorenessScore + fatigueScore) / 3;
      
      return {
        muscleGroup: feedback.muscleGroup,
        recoveryScore
      };
    });
  };

  const updateRecoveryFeedback = (muscleGroup: string, metric: keyof RecoveryFeedback, value: number) => {
    setRecoveryFeedback(prev => {
      const existing = prev.find(f => f.muscleGroup === muscleGroup);
      
      if (existing) {
        return prev.map(f => f.muscleGroup === muscleGroup ? { ...f, [metric]: value } : f);
      } else {
        return [...prev, {
          muscleGroup,
          rir: metric === 'rir' ? value : 2,
          pump: metric === 'pump' ? value : 3,
          soreness: metric === 'soreness' ? value : 3,
          fatigue: metric === 'fatigue' ? value : 3
        }];
      }
    });
  };

  const generateNewWorkoutPlan = (
    volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate', 
    selectedExercises: string[] = [],
    phaseType?: string
  ) => {
    if (!user || !exercises.length) return;
    
    const options = {
      experience: user.experience || 'beginner',
      availableDays: user.availableDays || ['mon', 'wed', 'fri'],
      equipment: user.equipment || ['barbell', 'dumbbell'],
      trainingGoal: user.trainingGoal || 'hypertrophy',
      priorityMuscles: user.priorityMuscles || [],
      volumeLevel,
      selectedExercises,
      currentWeek,
      userFeedback: calculateRecoveryScores(),
      phaseType // Add phase type to options
    };
    
    const newPlan = generateWorkoutPlan(exercises, options);
    
    // Add phase type to the workouts
    if (phaseType) {
      newPlan.forEach(workout => {
        workout.phaseType = phaseType;
      });
    }
    
    setWorkoutPlan(newPlan);
    if (user.id) {
      localStorage.setItem(`workoutPlan-${user.id}`, JSON.stringify(newPlan));
    }
    
    // Generate a descriptive message about the plan
    const isDeloadWeek = currentWeek % 5 === 0;
    let description = `Created a ${options.experience} level plan with ${typeof options.availableDays === 'number' ? options.availableDays : options.availableDays.length} days per week.`;
    
    if (phaseType) {
      description += ` Plan optimized for ${phaseType.replace('_', ' ')} phase.`;
    }
    
    if (isDeloadWeek) {
      description += ' This is a DELOAD week with reduced volume and intensity.';
    } else if (currentWeek === 1) {
      description += ' Starting at MEV (Minimum Effective Volume).';
    } else if (currentWeek === 3) {
      description += ' Working at MAV (Maximum Adaptive Volume).';
    } else if (currentWeek === 4) {
      description += ' Pushing above MAV for peak volume.';
    }
    
    toast({
      title: `Week ${currentWeek} Workout Plan Created`,
      description,
    });
    
    return newPlan;
  };

  const progressToNextWeek = () => {
    setCurrentWeek(prev => prev + 1);
    // Reset recovery feedback for new week
    setRecoveryFeedback([]);
    
    toast({
      title: "Progressed to Next Week",
      description: `Moving to Week ${currentWeek + 1}. Your feedback has been used to adjust your next workout.`,
    });
  };

  return { 
    generateNewWorkoutPlan, 
    currentWeek, 
    setCurrentWeek,
    recoveryFeedback,
    updateRecoveryFeedback,
    progressToNextWeek,
    isDeloadWeek: currentWeek % 5 === 0
  };
};
