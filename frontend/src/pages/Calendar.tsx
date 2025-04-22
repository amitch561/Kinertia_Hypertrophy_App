import { useState } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button-component";
import { Calendar as CalendarComponent } from "@/components/ui/calendar-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-container";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Calendar as CalendarIcon, BarChart as ChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-navigation";

type ProgressData = {
  week: string;
  volume: number;
  intensity: number;
};

const mockProgressData: ProgressData[] = [
  { week: "Week 1", volume: 15000, intensity: 65 },
  { week: "Week 2", volume: 18000, intensity: 70 },
  { week: "Week 3", volume: 20000, intensity: 72 },
  { week: "Week 4", volume: 22000, intensity: 75 },
];

const Calendar = () => {
  const { workoutPlan, completedWorkouts } = useWorkout();
  const [date, setDate] = useState<Date>(new Date());
  const [tab, setTab] = useState("calendar");

  const workoutsOnSelectedDate = completedWorkouts.filter(
    workout => workout.date.substring(0, 10) === format(date, "yyyy-MM-dd")
  );

  const completedDates = completedWorkouts.map(workout => 
    new Date(workout.date.substring(0, 10))
  );

  const chartConfig = {
    volume: {
      label: "Volume (kg)",
      color: "#E65A00",
    },
    intensity: {
      label: "Intensity (%)",
      color: "#6A7295",
    },
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Workout History</h1>
          <Tabs value={tab} onValueChange={setTab} className="w-auto">
            <TabsList className="bg-[#2F2F2F]">
              <TabsTrigger 
                value="calendar" 
                className="data-[state=active]:bg-[#E65A00]"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="data-[state=active]:bg-[#E65A00]"
              >
                <ChartIcon className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="calendar" className="mt-0">
          <div className="grid md:grid-cols-[300px_1fr] gap-4">
            <Card className="bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="bg-[#2F2F2F] border-[#454545] rounded-md"
                  modifiers={{
                    highlighted: completedDates
                  }}
                  modifiersStyles={{
                    highlighted: {
                      backgroundColor: 'rgba(230, 90, 0, 0.25)',
                      borderRadius: '50%'
                    }
                  }}
                />
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                {format(date, "MMMM d, yyyy")}
              </h2>

              {workoutsOnSelectedDate.length > 0 ? (
                workoutsOnSelectedDate.map((workout, index) => {
                  const workoutDetails = workoutPlan.find(
                    (plan) => plan.id === workout.workoutId
                  );
                  return (
                    <Card key={index} className="mb-4 bg-[#2F2F2F] border-[#454545]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {workoutDetails?.name || "Workout"}
                        </CardTitle>
                        <CardDescription>
                          Completed on {format(new Date(workout.date), "h:mm a")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {workout.exercises.map((ex, exIndex) => {
                          const exercise = workoutPlan
                            .flatMap((w) => w.exercises)
                            .find((e) => e.exerciseId === ex.exerciseId);
                          
                          const exerciseDetails = exercise 
                            ? { name: "Unknown Exercise" } 
                            : { name: "Unknown Exercise" };
                            
                          return (
                            <div
                              key={exIndex}
                              className="py-2 border-b border-[#454545] last:border-0"
                            >
                              <div className="font-medium">{exerciseDetails.name}</div>
                              <div className="text-sm text-gray-400 mt-1">
                                {ex.sets.map((set, setIndex) => (
                                  <span key={setIndex} className="mr-3">
                                    {set.weight}kg × {set.reps}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="bg-[#2F2F2F] border-[#454545]">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="mb-3 text-gray-400">No workouts completed on this date</p>
                      <Button 
                        className="bg-[#E65A00] hover:bg-[#FF7A22]"
                        onClick={() => window.location.href = '/workout'}
                      >
                        Start Workout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <CardTitle className="text-lg">Volume Progression</CardTitle>
                <CardDescription>Weekly training volume (kg)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProgressData}>
                      <XAxis 
                        dataKey="week" 
                        stroke="#6A7295" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6A7295" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#1A1A1A] border border-[#454545] p-2 rounded-md text-sm">
                                <p className="mb-1 font-medium">{payload[0].payload.week}</p>
                                <p>Volume: {payload[0].value} kg</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="volume" 
                        fill="#E65A00"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </CardContent>
            </Card>

            <Card className="bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <CardTitle className="text-lg">Intensity Progression</CardTitle>
                <CardDescription>Average intensity per week (%1RM)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProgressData}>
                      <XAxis 
                        dataKey="week" 
                        stroke="#6A7295" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6A7295" 
                        fontSize={12} 
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[#1A1A1A] border border-[#454545] p-2 rounded-md text-sm">
                                <p className="mb-1 font-medium">{payload[0].payload.week}</p>
                                <p>Intensity: {payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="intensity" 
                        fill="#6A7295"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <CardTitle className="text-lg">Muscle Group Focus</CardTitle>
                <CardDescription>Volume distribution by muscle group</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map(muscle => (
                    <div key={muscle} className="bg-[#1A1A1A] rounded-lg p-4">
                      <div className="font-medium mb-2">{muscle}</div>
                      <div className="w-full bg-[#454545] rounded-full h-2.5">
                        <div 
                          className="bg-[#E65A00] h-2.5 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        {Math.floor(Math.random() * 5000) + 1000} kg total
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default Calendar;
