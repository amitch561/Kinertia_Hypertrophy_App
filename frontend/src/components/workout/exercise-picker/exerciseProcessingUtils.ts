
import { Exercise } from "@/types/workout";
import { shouldRecommendExercise } from "@/lib/workout/exercises/exerciseFilters";

export interface ProcessedExercise {
  exercise: Exercise;
  isRecommended: boolean;
  recommendationNote: string;
  relevanceScore: number;
}

export const processExercises = (
  exercises: Exercise[],
  selectedExercises: string[],
  focusMuscleGroups: string[],
  volumeInfo: any,
  isMinimumVolume: boolean,
  isMaximumVolume: boolean,
  userExperience: string,
  chestDistribution?: {
    upper: number;
    mid: number;
    lower: number;
    total: number;
    hasThreeSubgroups: boolean;
  }
): ProcessedExercise[] => {
  return exercises.map(exercise => {
    const isRecommended = exercise.recommended || 
      shouldRecommendExercise(
        exercise, 
        focusMuscleGroups, 
        exercises.filter(e => selectedExercises.includes(e.id))
      );

    let recommendationNote = "";
    let relevanceScore = 0;

    if (isMinimumVolume) {
      if (exercise.exerciseType === 'compound') {
        relevanceScore += 10;
      } else if (!isRecommended) {
        recommendationNote = "Not optimal for minimum volume training";
        relevanceScore -= 5;
      }
    } else if (isMaximumVolume) {
      const hasEnoughCompounds = selectedExercises.some(id => {
        const ex = exercises.find(e => e.id === id);
        return ex?.muscleGroup === exercise.muscleGroup && ex?.exerciseType === 'compound';
      });
      
      if (exercise.exerciseType === 'isolation' && hasEnoughCompounds) {
        relevanceScore += 5;
        recommendationNote = "Good for maximizing volume";
      } else if (exercise.exerciseType === 'compound') {
        relevanceScore += 8;
      }
    }

    if (exercise.recommended) {
      relevanceScore += 20;
    }

    if (focusMuscleGroups.includes(exercise.muscleGroup)) {
      relevanceScore += 15;
    }

    // Handle chest distribution if available
    if (exercise.muscleGroup === 'chest' && chestDistribution && chestDistribution.total >= 3) {
      const subgroupId = exercise.id.includes('upper') ? 'upper' : 
                        exercise.id.includes('mid') ? 'mid' : 
                        exercise.id.includes('lower') ? 'lower' : '';
      
      if (subgroupId) {
        const currentSubCount = chestDistribution[subgroupId as keyof typeof chestDistribution] as number;
        const avgSubCount = chestDistribution.total / 3;
        
        if (currentSubCount < avgSubCount) {
          relevanceScore += 25;
          recommendationNote = `Balance your chest training (${subgroupId} is underrepresented)`;
        } else if (currentSubCount > avgSubCount && currentSubCount >= 2) {
          relevanceScore -= 15;
          recommendationNote = `Consider other areas of chest (${subgroupId} already has enough focus)`;
        }
      }
    }

    return {
      exercise,
      isRecommended,
      recommendationNote,
      relevanceScore
    };
  });
};

export const sortProcessedExercises = (exercises: ProcessedExercise[]): ProcessedExercise[] => {
  return exercises.sort((a, b) => {
    if (a.relevanceScore !== b.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    
    if (a.exercise.exerciseType === 'compound' && b.exercise.exerciseType !== 'compound') return -1;
    if (a.exercise.exerciseType !== 'compound' && b.exercise.exerciseType === 'compound') return 1;
    
    return a.exercise.name.localeCompare(b.exercise.name);
  });
};
