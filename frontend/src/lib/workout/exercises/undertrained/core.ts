
import type { UndertrainedGroups } from './types';

export const undertrainedCore: UndertrainedGroups = {
  "upper_abs": {
    muscleGroup: "core",
    priority: 5,
    name: "Upper Abs",
    description: "Well-trained with basic ab exercises",
    evidenceSource: "Primary focus of most core training"
  },
  "lower_abs": {
    muscleGroup: "core",
    priority: 7,
    name: "Lower Abs",
    description: "Requires specific lower ab targeting",
    evidenceSource: "Often neglected in favor of upper ab work"
  },
  "obliques": {
    muscleGroup: "core",
    priority: 7,
    name: "Obliques",
    description: "Requires rotational or side flexion movements",
    evidenceSource: "Needs dedicated oblique training"
  }
};
