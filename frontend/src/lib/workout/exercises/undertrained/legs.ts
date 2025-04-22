
import type { UndertrainedGroups } from './types';

export const undertrainedLegs: UndertrainedGroups = {
  "quads": {
    muscleGroup: "legs",
    priority: 4,
    name: "Quadriceps",
    description: "Well-trained in most leg workouts",
    evidenceSource: "Frequently emphasized in standard training programs"
  },
  "hamstrings": {
    muscleGroup: "legs",
    priority: 9,
    name: "Hamstrings",
    description: "Often underdeveloped compared to quads",
    evidenceSource: "Training program analysis shows quad dominance in program design"
  },
  "glute_maximus": {
    muscleGroup: "glutes",
    priority: 7,
    name: "Glute Maximus",
    description: "Requires hip extension movements",
    evidenceSource: "Often under-activated in standard leg routines"
  },
  "glute_medius": {
    muscleGroup: "glutes",
    priority: 9,
    name: "Glute Medius",
    description: "Requires abduction movements",
    evidenceSource: "Rarely hit without specific abduction work"
  }
};
