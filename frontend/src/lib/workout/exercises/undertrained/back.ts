
import type { UndertrainedGroups } from './types';

export const undertrainedBack: UndertrainedGroups = {
  "lats": {
    muscleGroup: "back",
    priority: 4,
    name: "Latissimus Dorsi",
    description: "Well-trained with pull-downs and rows",
    evidenceSource: "Frequently trained via conventional back exercises"
  },
  "back_upper": {
    muscleGroup: "back",
    priority: 7,
    name: "Rhomboids & Mid-Traps",
    description: "Requires dedicated rowing movements",
    evidenceSource: "Not isolated unless rowing volume is high"
  },
  "back_lower": {
    muscleGroup: "back",
    priority: 9,
    name: "Lower Traps",
    description: "Requires specific pulling patterns",
    evidenceSource: "Poorly trained without face pulls or Y-raises"
  }
};
