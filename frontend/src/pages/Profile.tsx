
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkout } from "@/contexts/WorkoutContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  LogOut, 
  Dumbbell, 
  Target, 
  Calendar, 
  Weight 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { generateNewWorkoutPlan } = useWorkout();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state (initialized with user's current preferences)
  const [trainingGoal, setTrainingGoal] = useState<'hypertrophy' | 'strength' | 'maintenance'>(
    (user?.trainingGoal || "hypertrophy") as 'hypertrophy' | 'strength' | 'maintenance'
  );
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>(
    (user?.experience || "beginner") as 'beginner' | 'intermediate' | 'advanced'
  );
  const [availableDays, setAvailableDays] = useState<number>(user?.availableDays || 3);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    user?.equipment || ["bodyweight"]
  );
  
  // Equipment options
  const equipmentOptions = [
    { id: 'bodyweight', label: 'Bodyweight only' },
    { id: 'dumbbell', label: 'Dumbbells' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'bench', label: 'Bench' },
    { id: 'squat rack', label: 'Squat Rack' },
    { id: 'cable machine', label: 'Cable Machine' },
    { id: 'leg press machine', label: 'Leg Press Machine' },
    { id: 'pull-up bar', label: 'Pull-up Bar' }
  ];
  
  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment(prev => {
      if (prev.includes(equipmentId)) {
        // If it's the only equipment, don't remove it
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  // Type-safe handler for training goal
  const handleTrainingGoalChange = (value: string) => {
    setTrainingGoal(value as 'hypertrophy' | 'strength' | 'maintenance');
  };

  // Type-safe handler for experience level
  const handleExperienceChange = (value: string) => {
    setExperience(value as 'beginner' | 'intermediate' | 'advanced');
  };
  
  const handleSaveChanges = () => {
    if (user) {
      updateUserProfile({
        trainingGoal,
        experience,
        availableDays,
        equipment: selectedEquipment,
      });
      
      toast({
        title: "Profile updated",
        description: "Your training preferences have been saved",
      });
      
      setIsEditing(false);
      
      // Generate a new workout plan based on the updated preferences
      generateNewWorkoutPlan();
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <User className="mr-2 h-6 w-6 text-[#E65A00]" />
          User Profile
        </h1>
        
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card className="bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <Button 
                    variant="ghost" 
                    className="text-[#E65A00] hover:text-[#FF7A22] hover:bg-transparent"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {user && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-medium min-w-[120px]">Name:</div>
                      <div>{user.name}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="font-medium min-w-[120px]">Email:</div>
                      <div>{user.email}</div>
                    </div>
                    <Separator className="bg-[#454545]" />
                    <div className="pt-2">
                      <div className="font-medium mb-2">Training Preferences:</div>
                      {!isEditing ? (
                        <div className="space-y-2 text-gray-300">
                          <div className="flex gap-2 items-center">
                            <Target className="h-4 w-4 text-[#E65A00]" />
                            Goal: {user.trainingGoal || "Not set"}
                          </div>
                          <div className="flex gap-2 items-center">
                            <Dumbbell className="h-4 w-4 text-[#E65A00]" />
                            Experience: {user.experience || "Not set"}
                          </div>
                          <div className="flex gap-2 items-center">
                            <Calendar className="h-4 w-4 text-[#E65A00]" />
                            Available days: {user.availableDays || "Not set"}
                          </div>
                          <div className="flex gap-2 items-start">
                            <Weight className="h-4 w-4 text-[#E65A00] mt-0.5" />
                            <div>
                              <div>Equipment:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.equipment && user.equipment.map(eq => (
                                  <span 
                                    key={eq} 
                                    className="bg-[#1A1A1A] text-xs px-2 py-1 rounded"
                                  >
                                    {eq}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="goal">Training Goal</Label>
                            <Select 
                              value={trainingGoal} 
                              onValueChange={handleTrainingGoalChange}
                            >
                              <SelectTrigger 
                                id="goal" 
                                className="bg-[#1A1A1A] border-[#454545]"
                              >
                                <SelectValue placeholder="Select goal" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#2F2F2F] border-[#454545] text-white">
                                <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                                <SelectItem value="strength">Strength</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="experience">Experience Level</Label>
                            <Select 
                              value={experience} 
                              onValueChange={handleExperienceChange}
                            >
                              <SelectTrigger 
                                id="experience" 
                                className="bg-[#1A1A1A] border-[#454545]"
                              >
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#2F2F2F] border-[#454545] text-white">
                                <SelectItem value="beginner">Beginner (0-1 year)</SelectItem>
                                <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                                <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="days">Available Days Per Week</Label>
                            <Select 
                              value={availableDays.toString()} 
                              onValueChange={(val: string) => setAvailableDays(parseInt(val))}
                            >
                              <SelectTrigger 
                                id="days" 
                                className="bg-[#1A1A1A] border-[#454545]"
                              >
                                <SelectValue placeholder="Select days per week" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#2F2F2F] border-[#454545] text-white">
                                <SelectItem value="1">1 day per week</SelectItem>
                                <SelectItem value="2">2 days per week</SelectItem>
                                <SelectItem value="3">3 days per week</SelectItem>
                                <SelectItem value="4">4 days per week</SelectItem>
                                <SelectItem value="5">5 days per week</SelectItem>
                                <SelectItem value="6">6 days per week</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="mb-2 block">Available Equipment</Label>
                            <div className="grid gap-2">
                              {equipmentOptions.map((equipment) => (
                                <div
                                  key={equipment.id}
                                  className="flex items-center space-x-2 border border-[#454545] p-3 rounded-md hover:bg-[#3A3A3A] cursor-pointer"
                                  onClick={() => handleEquipmentToggle(equipment.id)}
                                >
                                  <Checkbox 
                                    id={`equipment-${equipment.id}`}
                                    checked={selectedEquipment.includes(equipment.id)}
                                    onCheckedChange={() => handleEquipmentToggle(equipment.id)}
                                    className="border-[#6A7295] data-[state=checked]:bg-[#E65A00]"
                                  />
                                  <label
                                    htmlFor={`equipment-${equipment.id}`}
                                    className="text-sm font-medium cursor-pointer flex-1"
                                  >
                                    {equipment.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleSaveChanges} 
                            className="w-full bg-[#E65A00] hover:bg-[#FF7A22]"
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode" className="cursor-pointer">Dark Mode</Label>
                  <Checkbox 
                    id="darkMode" 
                    checked={true} 
                    disabled={true}
                    className="border-[#6A7295] data-[state=checked]:bg-[#E65A00]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="cursor-pointer">Workout Reminders</Label>
                  <Checkbox 
                    id="notifications" 
                    className="border-[#6A7295] data-[state=checked]:bg-[#E65A00]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="metrics" className="cursor-pointer">Use Metric Units (kg)</Label>
                  <Checkbox 
                    id="metrics" 
                    checked={true}
                    className="border-[#6A7295] data-[state=checked]:bg-[#E65A00]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button 
                  onClick={() => logout()} 
                  variant="outline" 
                  className="w-full border-[#454545] text-white hover:bg-[#E65A00] hover:text-white hover:border-transparent"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-[#2F2F2F] border-[#454545]">
              <CardHeader>
                <CardTitle className="text-lg">App Version</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Kinertia Workout v1.0.0</p>
                <p className="text-xs text-gray-500 mt-1">© 2025 Kinertia Labs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
