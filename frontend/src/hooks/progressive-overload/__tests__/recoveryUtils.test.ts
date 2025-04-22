
import { calculateRecoveryScore } from '../recoveryUtils';
import type { RecoveryFeedback } from '../types';

describe('calculateRecoveryScore', () => {
  it('returns default score of 3 when no feedback is provided', () => {
    expect(calculateRecoveryScore(null as any)).toBe(3);
  });

  it('calculates recovery score correctly', () => {
    const feedback: RecoveryFeedback = {
      muscleGroup: 'chest',
      rir: 2,
      pump: 4,
      soreness: 3,
      fatigue: 2
    };
    // Expected: (4 + (6-3) + (6-2)) / 3 = (4 + 3 + 4) / 3 = 3.67
    expect(calculateRecoveryScore(feedback)).toBeCloseTo(3.67);
  });
});
