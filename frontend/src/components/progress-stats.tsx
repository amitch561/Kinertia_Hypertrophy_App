
import { useState } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { CompletedWorkout } from "@/types/workout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card-container";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-navigation";
import { Calendar } from "@/components/ui/calendar-picker";
import { BarChart, TrendingUp, Calendar as CalendarIcon, Dumbbell } from "lucide-react";

const ProgressStats = () => {
  const { completedWorkouts, exercises, workoutPlan } = useWorkout();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  const getCompletedDates = (): Date[] => {
    return completedWorkouts.map(workout => new Date(workout.date));
  };
  
  const getWorkoutsByMonth = (): CompletedWorkout[] => {
    return completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.getMonth() === selectedMonth.getMonth() && 
             workoutDate.getFullYear() === selectedMonth.getFullYear();
    });
  };
  
  // Overall workout stats
  const totalWorkouts = completedWorkouts.length;
  const thisMonthWorkouts = getWorkoutsByMonth().length;
  
  // Get most recent workouts (last 5)
  const recentWorkouts = [...completedWorkouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const getExerciseName = (id: string) => {
    const exercise = exercises.find(ex => ex.id === id);
    return exercise ? exercise.name : "Unknown";
  };
  
  const getWorkoutName = (id: string) => {
    const workout = workoutPlan.find(wp => wp.id === id);
    return workout ? workout.name : "Custom Workout";
  };
  
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-purple-400" />
              Workout Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Workouts</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold">{thisMonthWorkouts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Streak</p>
                <p className="text-2xl font-bold">
                  {/* This is a simplified streak calculation for demo */}
                  {Math.min(totalWorkouts, 7)} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Workouts */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
              Recent Workouts
            </CardTitle>
            <CardDescription>Your 5 most recent workout sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{getWorkoutName(workout.workoutId)}</h3>
                      <time className="text-xs text-gray-500">{formatDate(workout.date)}</time>
                    </div>
                    <div className="text-sm space-y-1">
                      {workout.exercises.slice(0, 3).map((ex, i) => (
                        <p key={i} className="text-gray-600 line-clamp-1">
                          • {getExerciseName(ex.exerciseId)}: {ex.sets.length} sets
                        </p>
                      ))}
                      {workout.exercises.length > 3 && (
                        <p className="text-gray-500">+ {workout.exercises.length - 3} more exercises</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No workout history yet</p>
                <p className="text-sm mt-1">Complete your first workout to see stats here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-purple-400" />
            Workout Calendar
          </CardTitle>
          <CardDescription>View your workout history by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <Calendar
              mode="single"
              selected={selectedMonth}
              onSelect={(date) => date && setSelectedMonth(date)}
              modifiers={{
                completed: (date) => getCompletedDates().some(
                  completed => completed.toDateString() === date.toDateString()
                )
              }}
              modifiersClassNames={{
                completed: "bg-purple-100 border border-purple-300 text-purple-800 font-semibold"
              }}
              className="rounded-md border"
            />
          </div>
          <div className="flex justify-center items-center gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300 mr-1"></div>
              <span>Workout completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressStats;
