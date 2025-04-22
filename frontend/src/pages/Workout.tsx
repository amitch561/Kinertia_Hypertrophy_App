
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "@/contexts/WorkoutContext";
import WorkoutBackHeader from "@/components/workout/WorkoutBackHeader";
import WorkoutMainContent from "@/components/workout/WorkoutMainContent";

const Workout = () => {
  const { currentWorkout, exercises } = useWorkout();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentWorkout) {
      navigate("/create-workout");
    }
  }, [currentWorkout, navigate]);

  if (!currentWorkout) return null;

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <WorkoutBackHeader title="Workout" />
      <WorkoutMainContent currentWorkout={currentWorkout} exercises={exercises} />
    </div>
  );
};

export default Workout;
