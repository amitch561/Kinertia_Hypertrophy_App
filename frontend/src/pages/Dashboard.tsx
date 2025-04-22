import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkout } from "@/contexts/WorkoutContext";
import CollapsibleVolumeTracker from "@/components/CollapsibleVolumeTracker";
import CurrentWorkoutCard from "@/components/dashboard/current-workout-card";
import UpcomingWorkouts from "@/components/dashboard/upcoming-workouts";
import MesocycleProgress from "@/components/dashboard/MesocycleProgress";
import UserHeader from "@/components/dashboard/UserHeader";
import CurrentPhaseDisplay from "@/components/dashboard/CurrentPhaseDisplay";
import TrainingSplitInfo from "@/components/dashboard/TrainingSplitInfo";

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    workoutPlan, 
    currentWorkout, 
    completedWorkouts, 
    setCurrentWorkout, 
    currentPhase, 
    macroCyclePlan,
    generateNewWorkoutPlan 
  } = useWorkout();
  
  const navigate = useNavigate();
  const [focusMuscleGroups, setFocusMuscleGroups] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.onboardingComplete) {
      navigate("/onboarding");
    }
  }, [user, navigate]);

  const totalWorkouts = workoutPlan?.length || 0;
  const completedCount = completedWorkouts?.length || 0;
  const currentWeek = Math.floor(completedCount / (totalWorkouts || 1)) + 1;
  const currentDay = (completedCount % (totalWorkouts || 1)) + 1;
  const progress = totalWorkouts ? (completedCount / (totalWorkouts * 4)) * 100 : 0;

  const getFirstIncompleteDayIndex = () => {
    if (!workoutPlan || workoutPlan.length === 0) return 0;
    
    for (let i = 0; i < workoutPlan.length; i++) {
      const workoutCompletions = completedWorkouts?.filter(
        cw => cw.workoutId === workoutPlan[i].id
      ) || [];
      if (workoutCompletions.length === 0) return i;
    }
    return 0;
  };

  const firstIncompleteDay = getFirstIncompleteDayIndex();

  const handleWorkoutSelect = (workout: any) => {
    if (!workout) return;
    setCurrentWorkout(workout);
    navigate('/workout');
  };

  const getCurrentAndUpcomingWorkouts = () => {
    if (!workoutPlan || workoutPlan.length === 0) return { current: null, upcoming: [] };
    
    const firstIncompleteIndex = getFirstIncompleteDayIndex();
    const current = firstIncompleteIndex < workoutPlan.length ? workoutPlan[firstIncompleteIndex] : null;
    
    const upcoming = current ? workoutPlan.slice(firstIncompleteIndex + 1) : [];
    
    return { current, upcoming };
  };

  const handleCreateWorkout = () => {
    navigate("/create-workout", {
      state: { focusMuscleGroups }
    });
  };

  if (!user) return null;

  const { current: currentWorkoutDay, upcoming: upcomingWorkouts } = getCurrentAndUpcomingWorkouts();
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-4">
      <UserHeader userName={user.name} />

      <CurrentPhaseDisplay currentPhase={currentPhase} />

      <MesocycleProgress 
        currentWeek={currentWeek}
        currentDay={currentDay}
        progress={progress}
      />

      <div className="mb-4">
        <a
          href={macroCyclePlan ? "/mesocycles" : "/create-plan"}
          className="inline-block text-xs text-primary bg-neutral-light hover:underline rounded px-3 py-1 transition"
        >
          {macroCyclePlan ? "View Long-term Plan" : "Create Long-term Plan"}
        </a>
      </div>

      <TrainingSplitInfo workoutPlan={workoutPlan} />

      <div className="mb-6">
        <CollapsibleVolumeTracker />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Your Training Split</h3>
        
        {currentWorkoutDay ? (
          <div className="space-y-4">
            <CurrentWorkoutCard
              workout={currentWorkoutDay}
              currentWeek={currentWeek}
              currentDay={currentDay}
              onSelect={handleWorkoutSelect}
              currentPhase={currentPhase}
            />

            {upcomingWorkouts.length > 0 && (
              <UpcomingWorkouts
                workouts={upcomingWorkouts}
                firstIncompleteDay={firstIncompleteDay + 1}
              />
            )}
          </div>
        ) : (
          <div className="bg-[#23292F] border border-[#434345] rounded-lg p-4 text-center">
            <p className="mb-4">No workouts available in your training split.</p>
            <button 
              onClick={handleCreateWorkout}
              className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            >
              Create Workout Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
