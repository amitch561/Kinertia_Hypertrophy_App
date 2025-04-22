
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkout } from "@/contexts/WorkoutContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-container";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider-input";
import Header from "@/components/Header";
import { Calendar, CalendarCheck } from "lucide-react";
import { addDays, format, differenceInDays, differenceInWeeks } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type Phase = {
  name: string;
  type: 'general_prep' | 'specific_prep' | 'peak' | 'transition';
  percentage: number;
  focusType: 'hypertrophy' | 'strength' | 'peaking' | 'recovery';
  color: string;
  duration: number; // in weeks
};

const phaseDescriptions: Record<Phase['type'], string> = {
  general_prep: "Build foundational fitness and endurance to prepare your body for higher intensity training.",
  specific_prep: "Focus on strength and skills specific to your upcoming performance goals.",
  peak: "Reach your maximum performance with high-intensity, low-volume training to peak your abilities.",
  transition: "Allow your body to recover and adapt with lighter training before starting a new cycle."
};

const MacroCyclePlanPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { setMacroCyclePlan } = useWorkout();
  
  const [goalName, setGoalName] = useState<string>("General Fitness");
  const [targetDate, setTargetDate] = useState<string>(() => {
    const sixMonthsFromNow = addDays(new Date(), 180);
    return format(sixMonthsFromNow, "yyyy-MM-dd");
  });
  
  const [phases, setPhases] = useState<Phase[]>([
    { 
      name: "General Preparation", 
      type: 'general_prep', 
      percentage: 40, 
      focusType: 'hypertrophy',
      color: '#4CAF50',
      duration: 0
    },
    { 
      name: "Specific Preparation", 
      type: 'specific_prep', 
      percentage: 30, 
      focusType: 'strength',
      color: '#2196F3',
      duration: 0
    },
    { 
      name: "Peak", 
      type: 'peak', 
      percentage: 20, 
      focusType: 'peaking',
      color: '#F44336',
      duration: 0
    },
    { 
      name: "Transition", 
      type: 'transition', 
      percentage: 10, 
      focusType: 'recovery',
      color: '#9C27B0',
      duration: 0
    }
  ]);

  // Calculate total duration and phase durations
  const calculateDurations = () => {
    const today = new Date();
    const target = new Date(targetDate);
    
    if (target <= today) {
      toast({
        title: "Invalid date",
        description: "Target date must be in the future",
        variant: "destructive"
      });
      return;
    }
    
    const totalDays = differenceInDays(target, today);
    const totalWeeks = Math.max(4, Math.ceil(differenceInWeeks(target, today)));
    
    // Update durations based on percentages
    const updatedPhases = phases.map(phase => {
      const phaseDurationWeeks = Math.max(1, Math.round((phase.percentage / 100) * totalWeeks));
      return {
        ...phase,
        duration: phaseDurationWeeks
      };
    });
    
    setPhases(updatedPhases);
    return { totalDays, totalWeeks, updatedPhases };
  };
  
  useEffect(() => {
    calculateDurations();
  }, [targetDate]);

  const handlePhasePercentageChange = (index: number, value: number[]) => {
    if (!value[0]) return;
    
    const oldValue = phases[index].percentage;
    const difference = value[0] - oldValue;
    
    if (value[0] < 5) return;
    
    let remainingDiff = -difference;
    
    const updatedPhases = [...phases];
    updatedPhases[index].percentage = value[0];
    
    if (difference !== 0) {
      let totalOtherPercentage = 0;
      phases.forEach((phase, i) => {
        if (i !== index) totalOtherPercentage += phase.percentage;
      });
      
      phases.forEach((phase, i) => {
        if (i !== index) {
          const adjustmentRatio = phase.percentage / totalOtherPercentage;
          const adjustment = Math.round(remainingDiff * adjustmentRatio);
          
          if (updatedPhases[i].percentage + adjustment < 5) {
            updatedPhases[i].percentage = 5;
          } else {
            updatedPhases[i].percentage += adjustment;
          }
        }
      });
      
      let newTotal = updatedPhases.reduce((sum, phase) => sum + phase.percentage, 0);
      if (newTotal !== 100) {
        let largestIndex = 0;
        let largestValue = 0;
        updatedPhases.forEach((phase, i) => {
          if (i !== index && phase.percentage > largestValue) {
            largestValue = phase.percentage;
            largestIndex = i;
          }
        });
        updatedPhases[largestIndex].percentage += (100 - newTotal);
      }
    }
    
    setPhases(updatedPhases);
    calculateDurations();
  };

  const handlePhaseFocusChange = (index: number, focusType: 'hypertrophy' | 'strength' | 'peaking' | 'recovery') => {
    const updatedPhases = [...phases];
    updatedPhases[index].focusType = focusType;
    setPhases(updatedPhases);
  };

  const handleSubmit = () => {
    const { totalWeeks, updatedPhases } = calculateDurations() || { totalWeeks: 0, updatedPhases: phases };
    
    let currentDate = new Date();
    
    const phasesWithDates = updatedPhases.map(phase => {
      const startDate = new Date(currentDate);
      const durationInDays = phase.duration * 7;
      const endDate = addDays(currentDate, durationInDays - 1);
      currentDate = addDays(endDate, 1);
      
      return {
        ...phase,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        mesocycles: generateMesocycles(phase.duration, phase.focusType)
      };
    });
    
    const macroCyclePlan = {
      id: `macro-${Date.now()}`,
      name: goalName || "General Fitness",
      targetDate,
      created: format(new Date(), "yyyy-MM-dd"),
      totalWeeks,
      phases: phasesWithDates
    };
    
    setMacroCyclePlan(macroCyclePlan);
    
    toast({
      title: "Long-term Plan Created",
      description: `Your ${totalWeeks}-week plan has been created successfully.`
    });
    
    navigate("/mesocycles");
  };
  
  const generateMesocycles = (phaseDuration: number, focusType: string) => {
    const mesocycles = [];
    let weeksRemaining = phaseDuration;
    
    while (weeksRemaining > 0) {
      const mesoCycleLength = Math.min(4, weeksRemaining);
      weeksRemaining -= mesoCycleLength;
      
      let volumeLevel: 'minimum' | 'moderate' | 'maximum' = 'moderate';
      
      if (focusType === 'hypertrophy') {
        volumeLevel = weeksRemaining > 0 ? 'moderate' : 'maximum';
      } else if (focusType === 'strength') {
        volumeLevel = weeksRemaining > 0 ? 'moderate' : 'maximum';
      } else if (focusType === 'peaking') {
        volumeLevel = weeksRemaining > 0 ? 'maximum' : 'minimum';
      } else if (focusType === 'recovery') {
        volumeLevel = 'minimum';
      }
      
      mesocycles.push({
        id: `meso-${Date.now()}-${mesocycles.length}`,
        name: `${focusType.charAt(0).toUpperCase() + focusType.slice(1)} Phase - Block ${mesocycles.length + 1}`,
        focusType,
        weeks: mesoCycleLength,
        volumeLevel,
        deload: mesoCycleLength >= 4
      });
    }
    
    return mesocycles;
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-4">
      <Header />
      <div className="container max-w-4xl mx-auto mt-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-primary"
          >
            &lt; Back
          </Button>
          <h1 className="text-2xl font-bold">Create Long-term Plan</h1>
        </div>
        
        <Card className="mb-6 bg-neutral-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Set Your Goal & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                What are you training for? (Optional)
              </label>
              <Input 
                placeholder="e.g., Marathon, Competition, General Fitness"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="bg-[#2A2A2A] border-neutral-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <Input 
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-[#2A2A2A] border-neutral-700"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Your plan will be organized from today until this date
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6 bg-neutral-light">
          <CardHeader>
            <CardTitle>Training Phases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex w-full h-8 rounded-md overflow-hidden">
                {phases.map((phase, index) => (
                  <div 
                    key={phase.type}
                    style={{ 
                      width: `${phase.percentage}%`, 
                      backgroundColor: phase.color,
                    }}
                    className="flex items-center justify-center text-xs font-medium text-white"
                  >
                    {phase.percentage}%
                  </div>
                ))}
              </div>
              <div className="flex w-full mt-1 mb-4">
                {phases.map((phase, index) => (
                  <div 
                    key={`label-${phase.type}`}
                    style={{ width: `${phase.percentage}%` }}
                    className="text-xs text-center truncate px-1"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help underline decoration-dotted">
                          {phase.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        {phaseDescriptions[phase.type]}
                      </TooltipContent>
                    </Tooltip>
                    <div className="text-xs opacity-75">
                      {phase.duration} weeks
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {phases.map((phase, index) => (
              <div key={phase.type} className="mb-6 border border-neutral-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-medium cursor-help" style={{ color: phase.color }}>
                        {phase.name}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      {phaseDescriptions[phase.type]}
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-sm">{phase.duration} weeks</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm mb-1">Percentage of Plan</label>
                  <Slider
                    defaultValue={[phase.percentage]}
                    max={85}
                    min={5}
                    step={5}
                    onValueChange={(value) => handlePhasePercentageChange(index, value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Training Focus</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['hypertrophy', 'strength', 'peaking', 'recovery'].map((focus) => (
                      <Button
                        key={focus}
                        variant={phase.focusType === focus ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePhaseFocusChange(index, focus as any)}
                        className={phase.focusType === focus ? "bg-primary" : ""}
                      >
                        {focus.charAt(0).toUpperCase() + focus.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex justify-end mb-10">
          <Button 
            onClick={handleSubmit}
            className="bg-[#E65A00] hover:bg-[#FF7A22]"
          >
            Create Long-term Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MacroCyclePlanPage;
