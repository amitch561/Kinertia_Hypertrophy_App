
import type { UndertrainedGroups } from './types';

export const undertrainedChest: UndertrainedGroups = {
  "chest_upper": {
    muscleGroup: "chest",
    priority: 6,
    name: "Upper Chest",
    description: "Requires incline movements for full development",
    evidenceSource: "Not hit effectively in flat press; needs incline work"
  },
  "chest_lower": {
    muscleGroup: "chest",
    priority: 7,
    name: "Lower Chest",
    description: "Requires decline or dip movements",
    evidenceSource: "Barnett et al., 1995: Rarely hit in flat/incline pressing"
  },
  "chest_mid": {
    muscleGroup: "chest",
    priority: 3,
    name: "Mid Chest",
    description: "Well-trained with standard flat bench press",
    evidenceSource: "Overemphasized in typical training programs"
  }
};
