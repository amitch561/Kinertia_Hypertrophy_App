
export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  subGroup?: SubGroupMetadata;
  subGroupId?: string; // Add this optional property
  description?: string;
  equipment: string[];
  recommended?: boolean;
  tips?: string[];
  exerciseType: 'compound' | 'isolation';
};

export type SubGroup = { 
  id: string; 
  name: string; 
  exercises: Exercise[]; 
};

export type MuscleGroup = {
  id: string;
  name: string;
  subGroups: SubGroup[];
  isFocus?: boolean;
  priority?: number;
};

// Define Set type for exercises
export type Set = {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  isWarmUp?: boolean;
  rpe?: number;
  rir?: number; 
  date?: string;
  skip?: boolean;
};

// Define WorkoutExercise type
export type WorkoutExercise = {
  exerciseId: string;
  sets: Set[];
  previousPerformance: {
    date: string;
    weight: number;
    reps: number;
  }[];
};

// Define Workout type
export type Workout = {
  id: string;
  name: string;
  day: number;
  exercises: WorkoutExercise[];
  phaseType?: string; // Add phase type for displaying in the workout card
  focusMuscleGroups?: string[]; // Add focus muscle groups
};

// Define CompletedWorkout type
export type CompletedWorkout = {
  workoutId: string;
  userId: string;
  date: string;
  exercises: WorkoutExercise[];
  feedback?: 'too_easy' | 'just_right' | 'too_hard';
};

// Define VolumeStatus type
export type VolumeStatus = {
  muscleGroup: string;
  current: number;
  min: number;
  moderate: number;
  max: number;
  isLow: boolean;
  isHigh: boolean;
  isSecondary?: boolean; // Add the isSecondary property
};

// Define MuscleGroupProgress type
export type MuscleGroupProgress = {
  muscleGroup: string;
  progress: number;
  target: number;
};

// Define ExerciseSelectionProps type
export type ExerciseSelectionProps = {
  muscleGroups: string[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string, isPushDay?: number) => void;
  splitType: string;
  selectedDays: string[];
  isReadOnly?: boolean;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
};

// Macro-cycle related types
export type MesoCycle = {
  id: string;
  name: string;
  focusType: 'hypertrophy' | 'strength' | 'peaking' | 'recovery';
  weeks: number;
  volumeLevel: 'minimum' | 'moderate' | 'maximum';
  deload: boolean;
  workouts?: Workout[];
};

export type TrainingPhase = {
  name: string;
  type: 'general_prep' | 'specific_prep' | 'peak' | 'transition';
  percentage: number;
  focusType: 'hypertrophy' | 'strength' | 'peaking' | 'recovery';
  color: string;
  duration: number;
  startDate: string;
  endDate: string;
  mesocycles: MesoCycle[];
};

export type MacroCyclePlan = {
  id: string;
  name: string;
  targetDate: string;
  created: string;
  totalWeeks: number;
  phases: TrainingPhase[];
};

export type SubGroupMetadata = {
  name: string;
  primaryGroup: string;
  secondaryWith?: string[];  // New field for tracking secondary movement patterns
  isEmphasized?: boolean;    // Track user override for secondary movers
};

// Add the type for undertrained subgroup priorities
export interface UndertrainedSubGroupPriority {
  muscleGroup: string;
  priority: number; // 1-10 scale, higher = more undertrained typically
  name: string;
  description: string;
  evidenceSource: string;
}
