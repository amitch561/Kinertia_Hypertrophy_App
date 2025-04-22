
import type { Exercise } from '@/types/workout';

export class ExerciseIndexes {
  private exercisesById = new Map<string, Exercise>();
  private exercisesByMuscleGroup = new Map<string, Exercise[]>();
  private recommendedExercises: Exercise[] = [];

  constructor(exercises: Exercise[]) {
    this.buildIndexes(exercises);
  }

  private buildIndexes(exercises: Exercise[]) {
    exercises.forEach(exercise => {
      // Index by ID
      this.exercisesById.set(exercise.id, exercise);
      
      // Index by muscle group
      if (!this.exercisesByMuscleGroup.has(exercise.muscleGroup)) {
        this.exercisesByMuscleGroup.set(exercise.muscleGroup, []);
      }
      this.exercisesByMuscleGroup.get(exercise.muscleGroup)?.push(exercise);
      
      // Track recommended exercises
      if (exercise.recommended) {
        this.recommendedExercises.push(exercise);
      }
    });
  }

  getById(id: string): Exercise | undefined {
    return this.exercisesById.get(id);
  }

  getByMuscleGroup(muscleGroup: string): Exercise[] {
    return this.exercisesByMuscleGroup.get(muscleGroup) || [];
  }

  getRecommended(muscleGroup?: string): Exercise[] {
    if (muscleGroup) {
      return this.recommendedExercises.filter(ex => ex.muscleGroup === muscleGroup);
    }
    return this.recommendedExercises;
  }
}
