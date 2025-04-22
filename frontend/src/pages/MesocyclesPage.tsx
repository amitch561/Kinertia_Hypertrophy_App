import React from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-container";
import { ChartBar, CalendarCheck, ChartLineIcon } from "lucide-react";
import { format } from "date-fns";

const MesocyclesPage = () => {
  const { 
    workoutPlan, 
    completedWorkouts, 
    macroCyclePlan, 
    currentPhase 
  } = useWorkout();

  // We'll assume each plan is a Mesocycle (tied to a start date or order)
  // For simplicity, just group by plan order (week/period) for now
  const mesocycles = workoutPlan.length ? [workoutPlan] : [];
  
  // Determine active and completed
  const isMesocycleCompleted = (mesocycle: any) =>
    mesocycle.every((workout: any) =>
      completedWorkouts.some((cw: any) => cw.workoutId === workout.id)
    );

  const activeMesocycleIdx = mesocycles.findIndex(m => !isMesocycleCompleted(m));
  
  // Get today's date for comparison
  const today = format(new Date(), "yyyy-MM-dd");
  
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-4">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="text-primary hover:underline">&lt; Back</Link>
          <h1 className="text-2xl font-bold ml-4">Training Plans</h1>
        </div>
        <Link to="/create-plan">
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Create Long-term Plan
          </Button>
        </Link>
      </header>
      
      {macroCyclePlan && (
        <Card className="mb-6 border-primary/40 bg-neutral-light">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <ChartLineIcon className="h-5 w-5 text-primary" />
              {macroCyclePlan.name} Plan
            </CardTitle>
            <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-md">
              {macroCyclePlan.totalWeeks} weeks
            </span>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">Target Date: {macroCyclePlan.targetDate}</div>
              
              {/* Timeline visualization */}
              <div className="flex w-full h-8 rounded-md overflow-hidden mb-1">
                {macroCyclePlan.phases.map((phase: any, index: number) => (
                  <div 
                    key={phase.type}
                    style={{ 
                      width: `${phase.percentage}%`, 
                      backgroundColor: phase.color,
                      position: 'relative'
                    }}
                    className="flex items-center justify-center text-xs font-medium text-white"
                  >
                    {phase.percentage}%
                    {phase.startDate <= today && phase.endDate >= today && (
                      <div className="absolute inset-0 border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex w-full mt-1 mb-2">
                {macroCyclePlan.phases.map((phase: any) => (
                  <div 
                    key={`label-${phase.type}`}
                    style={{ width: `${phase.percentage}%` }}
                    className="text-xs text-center truncate px-1"
                  >
                    {phase.name}
                  </div>
                ))}
              </div>
            </div>
            
            {currentPhase && (
              <div className="mb-4 p-3 bg-[#2a3040] rounded-lg">
                <div className="text-sm font-medium mb-1">Current Phase:</div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: currentPhase.color }}>
                    {currentPhase.name}
                  </span>
                  <span className="text-xs text-gray-300">
                    {currentPhase.startDate} to {currentPhase.endDate}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  Focus: <span className="text-primary capitalize">{currentPhase.focusType}</span>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Upcoming Mesocycles:</div>
              {macroCyclePlan.phases
                .filter((phase: any) => phase.startDate >= today || phase.endDate >= today)
                .flatMap((phase: any) => phase.mesocycles)
                .slice(0, 3)
                .map((mesocycle: any, idx: number) => (
                  <div 
                    key={mesocycle.id} 
                    className="flex items-center justify-between py-2 border-b border-neutral-700 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-sm">{mesocycle.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{mesocycle.weeks} weeks</span>
                      {mesocycle.deload && (
                        <span className="text-xs bg-[#5d4037] text-[#ffccbc] px-1.5 rounded">Deload</span>
                      )}
                      <span className="text-xs bg-primary/20 text-primary px-1.5 rounded capitalize">
                        {mesocycle.volumeLevel}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-primary" />
          Current Mesocycle
        </h2>
        <div className="space-y-4">
          {mesocycles.map((meso, idx) => (
            <Card
              key={idx}
              className={`border-2 ${idx === activeMesocycleIdx ? 'border-green-400' : 'border-neutral-800'} bg-neutral-light`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Mesocycle {idx + 1} {idx === activeMesocycleIdx ? "(Active)" : isMesocycleCompleted(meso) ? "(Completed)" : ""}
                  </span>
                  {currentPhase && (
                    <span className="text-sm font-normal bg-primary/20 text-primary px-2 py-1 rounded capitalize">
                      {currentPhase.focusType} Focus
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm">
                  {meso.map((w: any, i: number) => (
                    <li key={w.id}>
                      <span className="font-medium">{w.name || `Workout ${i + 1}`}</span> – {w.exercises.length} exercises
                      {completedWorkouts.some((cw: any) => cw.workoutId === w.id) ? (
                        <span className="ml-2 text-green-400">(Done)</span>
                      ) : (
                        <span className="ml-2 text-orange-300">(Pending)</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          {mesocycles.length === 0 && !macroCyclePlan && (
            <div className="text-center py-10">
              <CalendarCheck className="h-12 w-12 mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400">No mesocycles created yet.</p>
              <Link to="/create-workout">
                <Button className="mt-4 bg-primary">Create Your First Workout</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MesocyclesPage;
