
import { undertrainedShoulders } from './shoulders';
import { undertrainedChest } from './chest';
import { undertrainedBack } from './back';
import { undertrainedArms } from './arms';
import { undertrainedLegs } from './legs';
import { undertrainedCalves } from './calves';
import { undertrainedCore } from './core';
import type { UndertrainedGroups } from './types';

export const undertrainedSubGroups: UndertrainedGroups = {
  ...undertrainedShoulders,
  ...undertrainedChest,
  ...undertrainedBack,
  ...undertrainedArms,
  ...undertrainedLegs,
  ...undertrainedCalves,
  ...undertrainedCore
};

// Re-export types
export type { UndertrainedGroups } from './types';
