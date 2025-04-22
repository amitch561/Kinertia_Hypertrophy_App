
import { useState } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-navigation";
import { Search } from "lucide-react";

const ExerciseLibrary = () => {
  const { exercises } = useWorkout();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get unique muscle groups
  const muscleGroups = Array.from(new Set(exercises.map(ex => ex.muscleGroup)));
  
  // Filter exercises by search term
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.equipment.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-purple-100"
        />
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            All
          </TabsTrigger>
          {muscleGroups.map(group => (
            <TabsTrigger 
              key={group} 
              value={group}
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
          {filteredExercises.length === 0 && (
            <p className="text-center text-gray-500 py-4">No exercises found</p>
          )}
        </TabsContent>
        
        {muscleGroups.map(group => (
          <TabsContent key={group} value={group} className="space-y-4">
            {filteredExercises
              .filter(ex => ex.muscleGroup === group)
              .map(exercise => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const ExerciseCard = ({ exercise }: { exercise: any }) => {
  return (
    <Card className="exercise-card overflow-hidden border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-1">
          {exercise.equipment.map((eq: string, i: number) => (
            <span 
              key={i} 
              className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs"
            >
              {eq}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600">{exercise.description}</p>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <h4 className="text-sm font-medium mb-1">Tips:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {exercise.tips.slice(0, 2).map((tip: string, index: number) => (
            <li key={index}>{tip}</li>
          ))}
          {exercise.tips.length > 2 && (
            <details>
              <summary className="text-sm text-purple-500 cursor-pointer">More tips</summary>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-1">
                {exercise.tips.slice(2).map((tip: string, index: number) => (
                  <li key={index + 2}>{tip}</li>
                ))}
              </ul>
            </details>
          )}
        </ul>
      </CardFooter>
    </Card>
  );
};

export default ExerciseLibrary;
