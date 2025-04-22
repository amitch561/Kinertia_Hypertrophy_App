
import type { UndertrainedGroups } from './types';

export const undertrainedCalves: UndertrainedGroups = {
  "gastrocnemius": {
    muscleGroup: "calves",
    priority: 7,
    name: "Gastrocnemius",
    description: "Trained with straight-leg calf raises",
    evidenceSource: "Needs specific straight-leg calf work"
  },
  "soleus": {
    muscleGroup: "calves",
    priority: 8,
    name: "Soleus",
    description: "Requires seated or bent-knee calf raises",
    evidenceSource: "Needs dedicated seated calf work"
  }
};
