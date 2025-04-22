
import type { UndertrainedGroups } from './types';

export const undertrainedArms: UndertrainedGroups = {
  "biceps_short_head": {
    muscleGroup: "Biceps",
    priority: 6,
    name: "Biceps Short Head",
    description: "Requires supinated curl variations",
    evidenceSource: "Less activated in standard rowing movements"
  },
  "biceps_long_head": {
    muscleGroup: "Biceps",
    priority: 5,
    name: "Biceps Long Head",
    description: "Requires incline or hammer curl variations",
    evidenceSource: "Needs specific training for full development"
  },
  "triceps_long_head": {
    muscleGroup: "Triceps",
    priority: 8,
    name: "Triceps Long Head",
    description: "Requires overhead extensions",
    evidenceSource: "Not fully activated in standard pressing movements"
  },
  "triceps_lateral_head": {
    muscleGroup: "Triceps",
    priority: 5,
    name: "Triceps Lateral Head",
    description: "Well-trained with pushdowns and presses",
    evidenceSource: "Gets good activation in compound pressing movements"
  },
  "triceps_medial_head": {
    muscleGroup: "Triceps",
    priority: 6,
    name: "Triceps Medial Head",
    description: "Requires diamond pushups or close-grip work",
    evidenceSource: "Less activated in standard pressing movements"
  }
};
