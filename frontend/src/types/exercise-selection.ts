
import { VolumeStatus } from './workout';

export interface ExerciseSelectionProps {
  muscleGroups: string[];
  selectedExercises: string[];
  onExerciseToggle: (exerciseId: string) => void;
  splitType: string;
  selectedDays: string[];
  isReadOnly?: boolean;
  focusMuscleGroups?: string[];
  volumeLevel?: "minimum" | "moderate" | "maximum";
  volumeStatus?: VolumeStatus[];
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  skipSubGroups?: Record<string, string[]>;
}
