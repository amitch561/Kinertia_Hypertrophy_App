
import { Button } from "@/components/ui/button-component";
import { useNavigate } from "react-router-dom";
import { Exercise, WorkoutExercise } from "@/types/workout";

interface NoExercisesMessageProps {
  exercises: Exercise[];
  currentWorkout: {
    exercises?: WorkoutExercise[];
  };
}

const NoExercisesMessage = ({ exercises, currentWorkout }: NoExercisesMessageProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-8 p-4 border border-[#454545] rounded-md bg-[#252525]">
      <p className="text-gray-400 mb-2">No exercises found for this workout.</p>
      {exercises && exercises.length > 0 && currentWorkout.exercises && currentWorkout.exercises.length > 0 ? (
        <p className="text-xs text-gray-500">
          Unable to match workout exercises with exercise database. 
          Let's create a workout plan for you.
        </p>
      ) : exercises && exercises.length === 0 ? (
        <p className="text-xs text-gray-500">
          Let's set up your workout plan.
        </p>
      ) : currentWorkout.exercises && currentWorkout.exercises.length === 0 ? (
        <p className="text-xs text-gray-500">
          Let's create a workout plan with exercises.
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          Let's set up your workout properly.
        </p>
      )}
      <Button
        className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB]"
        onClick={() => navigate('/create-workout')}
      >
        Create Workout Plan
      </Button>
    </div>
  );
};

export default NoExercisesMessage;
