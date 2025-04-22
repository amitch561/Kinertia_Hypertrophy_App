
// Weekly total sets fix: Only count non-warmup, completed sets from this week

import React, { useState } from 'react';
import { useWorkout } from "@/contexts/WorkoutContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-container";
import { ChevronDown, ChevronUp } from "lucide-react";
import WeeklyVolumeTracker from './weekly-volume-tracker';

const CollapsibleVolumeTracker = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { volumeStatus, completedWorkouts } = useWorkout();

  // Calculate total weekly sets from completed workouts (completed working sets only, not warmups)
  const calculateTotalWeeklySets = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    // start on Sunday
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const currentWeekCompletedWorkouts = completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek;
    });

    // Count only completed working sets (not warmups)
    return currentWeekCompletedWorkouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + exercise.sets.filter(set => set.completed && !set.isWarmUp).length;
      }, 0);
    }, 0);
  };

  const totalSets = calculateTotalWeeklySets();

  return (
    <Card className="shadow-sm border-neutral-dark bg-background">
      <CardHeader
        className="px-4 py-2 flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <CardTitle className="text-base font-medium flex items-center">
            Weekly Volume Tracker
            <div className="flex items-center ml-2 text-sm font-normal text-gray-500">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                {totalSets} sets this week
              </span>
            </div>
          </CardTitle>
        </div>
        <div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <WeeklyVolumeTracker volumeStatus={volumeStatus} />
        </CardContent>
      )}
    </Card>
  );
};

export default CollapsibleVolumeTracker;
