
// Export all muscle-specific undertrainedGroups from their respective files
import { undertrainedShoulders } from './undertrained/shoulders';
import { undertrainedChest } from './undertrained/chest';
import { undertrainedBack } from './undertrained/back';
import { undertrainedArms } from './undertrained/arms';
import { undertrainedLegs } from './undertrained/legs';
import { undertrainedCalves } from './undertrained/calves';
import { undertrainedCore } from './undertrained/core';
import type { UndertrainedGroups } from './undertrained/types';

// Combine all undertrained subgroups into a single object
export const undertrainedSubGroups: UndertrainedGroups = {
  ...undertrainedShoulders,
  ...undertrainedChest,
  ...undertrainedBack,
  ...undertrainedArms,
  ...undertrainedLegs,
  ...undertrainedCalves,
  ...undertrainedCore
};

// Re-export the type
export type { UndertrainedGroups } from './undertrained/types';
