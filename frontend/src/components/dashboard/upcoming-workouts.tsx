
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import DayTile from "@/components/workout/workout-day-tile";
import { Workout } from "@/types/workout";

interface UpcomingWorkoutsProps {
  workouts: Workout[];
  firstIncompleteDay: number;
}

const UpcomingWorkouts = ({ workouts, firstIncompleteDay }: UpcomingWorkoutsProps) => {
  if (!workouts || workouts.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400">Upcoming Workouts in Split</p>
      <ScrollArea className="h-[140px]">
        <div className="flex gap-3 pb-2">
          {workouts.map((workout, index) => {
            if (!workout) return null;
            
            // Calculate the correct day number based on the first incomplete day
            const dayNumber = firstIncompleteDay + index;
            
            // All future workouts are locked until the current one is completed
            const isEnabled = false;
            
            return (
              <DayTile
                key={workout.id || index}
                workout={workout}
                dayIndex={dayNumber - 1} // Adjust for zero-based index
                isCompleted={false}
                isEnabled={isEnabled}
                onSelect={() => {}}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UpcomingWorkouts;
