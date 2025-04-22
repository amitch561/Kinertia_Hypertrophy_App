import React, { useMemo } from "react";
import { Exercise } from "@/types/workout";
import { useVolumeStatus } from "@/hooks/useVolumeStatus";
import { calculateCurrentVolumeStatus } from "@/contexts/workout-actions";
import { useAuth } from "@/contexts/AuthContext";
import { processExercises, sortProcessedExercises } from "./exercise-picker/exerciseProcessingUtils";
import ExercisePickerItem from "./exercise-picker/ExercisePickerItem";
import NoExercisesFound from "./exercise-picker/NoExercisesFound";
import { getSubGroupId } from "@/lib/workout/exercises/exerciseUtils";

interface ExercisePickerExerciseListProps {
  groupId: string;
  subGroupId: string | null;
  exercises: Exercise[];
  selectedExercises: string[];
  onSelectExercise: (exerciseId: string) => void;
  focusMuscleGroups: string[];
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
}

export function ExercisePickerExerciseList({
  groupId,
  subGroupId,
  exercises,
  selectedExercises,
  onSelectExercise,
  focusMuscleGroups = [],
  userExperience = 'beginner'
}: ExercisePickerExerciseListProps) {
  const { user } = useAuth();
  
  const filteredExercises = exercises.filter(ex => {
    // First filter by muscle group
    if (ex.muscleGroup !== groupId) return false;
    
    // If a subgroup is specified, filter by that subgroup
    if (subGroupId) {
      const exerciseSubgroupId = getSubGroupId(ex);
      
      // Hide medial head exercises for non-advanced users
      if (userExperience !== 'advanced' && 
          groupId === 'triceps' && 
          exerciseSubgroupId === 'triceps_medial_head') {
        return false;
      }
      
      // Get the subgroup ID for the exercise
      
      
      // Special case handling for common legacy subgroup IDs
      if (subGroupId === 'chest_upper' && exerciseSubgroupId === 'upper') return true;
      if (subGroupId === 'chest_mid' && exerciseSubgroupId === 'mid') return true;
      if (subGroupId === 'chest_lower' && exerciseSubgroupId === 'lower') return true;
      
      // Explicitly filter out general/unclassified subgroups
      if (exerciseSubgroupId === `${groupId}_general` || 
          exerciseSubgroupId === `${groupId}_primary` || 
          exerciseSubgroupId === groupId) {
        return false;
      }
      
      return exerciseSubgroupId === subGroupId;
    }
    
    // If no subgroup specified, include all exercises for this muscle group
    // But exclude generic subgroups
    const exerciseSubgroupId = getSubGroupId(ex);
    return !exerciseSubgroupId.includes('_general') && 
           !exerciseSubgroupId.includes('_primary') && 
           exerciseSubgroupId !== groupId;
  });

  const volumeStatus = calculateCurrentVolumeStatus(
    [], // Empty array for completedWorkouts 
    [], // Empty array for selectedWorkouts
    selectedExercises, 
    focusMuscleGroups
  );

  const { volumeStatusData } = useVolumeStatus(
    volumeStatus,
    focusMuscleGroups,
    'moderate'
  );
  
  const muscleGroupVolumeInfo = volumeStatusData.find(vs => vs.muscleGroup === groupId);
  const isMinimumVolume = muscleGroupVolumeInfo?.min === muscleGroupVolumeInfo?.moderate;
  const isMaximumVolume = muscleGroupVolumeInfo?.max === muscleGroupVolumeInfo?.moderate;

  const getSubgroupDistribution = () => {
    if (groupId !== 'chest') return null;
    
    const allChestExercises = exercises.filter(ex => ex.muscleGroup === 'chest');
    const selectedChestExercises = allChestExercises.filter(ex => 
      selectedExercises.includes(ex.id)
    );
    
    return {
      upper: selectedChestExercises.filter(ex => 
        getSubGroupId(ex) === 'chest_upper' || getSubGroupId(ex) === 'upper'
      ).length,
      mid: selectedChestExercises.filter(ex => 
        getSubGroupId(ex) === 'chest_mid' || getSubGroupId(ex) === 'mid'
      ).length,
      lower: selectedChestExercises.filter(ex => 
        getSubGroupId(ex) === 'chest_lower' || getSubGroupId(ex) === 'lower'
      ).length,
      total: selectedChestExercises.length,
      hasThreeSubgroups: true
    };
  };
  
  const chestDistribution = getSubgroupDistribution();

  const enhancedExercises = useMemo(() => {
    const processed = processExercises(
      filteredExercises,
      selectedExercises,
      focusMuscleGroups,
      muscleGroupVolumeInfo,
      isMinimumVolume,
      isMaximumVolume,
      userExperience,
      chestDistribution
    );
    
    return sortProcessedExercises(processed);
  }, [filteredExercises, focusMuscleGroups, selectedExercises, isMinimumVolume, isMaximumVolume, userExperience, chestDistribution]);

  return (
    <div className="grid grid-cols-1 gap-2 mt-2">
      {enhancedExercises.map((processedExercise) => (
        <ExercisePickerItem
          key={processedExercise.exercise.id}
          processedExercise={processedExercise}
          isSelected={selectedExercises.includes(processedExercise.exercise.id)}
          onSelect={onSelectExercise}
          volumeInfo={muscleGroupVolumeInfo}
        />
      ))}
      
      {filteredExercises.length === 0 && <NoExercisesFound />}
    </div>
  );
}

export default ExercisePickerExerciseList;
