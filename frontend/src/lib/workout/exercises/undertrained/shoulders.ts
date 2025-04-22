
import type { UndertrainedGroups } from './types';

export const undertrainedShoulders: UndertrainedGroups = {
  "rear_delts": {
    muscleGroup: "shoulders",
    priority: 10,
    name: "Rear Deltoids",
    description: "Often neglected in pressing-dominant routines",
    evidenceSource: "Schoenfeld, 2010: EMG studies show lower activation in common pressing movements"
  },
  "side_delts": {
    muscleGroup: "shoulders",
    priority: 8,
    name: "Side Deltoids",
    description: "Requires dedicated lateral raises for full development",
    evidenceSource: "Lower activation in compound movements compared to isolation work"
  },
  "front_delts": {
    muscleGroup: "shoulders",
    priority: 2,
    name: "Front Deltoids",
    description: "Highly activated in all pressing movements",
    evidenceSource: "Gets significant volume from bench press and overhead press variations"
  }
};
