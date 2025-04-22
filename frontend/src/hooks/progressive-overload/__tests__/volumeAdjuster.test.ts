
import { adjustVolumeBasedOnRecovery } from '../volumeAdjuster';

describe('adjustVolumeBasedOnRecovery', () => {
  it('reduces volume by 50% during deload week', () => {
    expect(adjustVolumeBasedOnRecovery(10, 3, true, 5, 15)).toBe(5);
  });

  it('increases volume when recovery score is good and below max', () => {
    expect(adjustVolumeBasedOnRecovery(10, 4.5, false, 5, 15)).toBe(11);
  });

  it('decreases volume when recovery score is poor and above min', () => {
    expect(adjustVolumeBasedOnRecovery(10, 1.5, false, 5, 15)).toBe(9);
  });

  it('maintains volume when within bounds and recovery is moderate', () => {
    expect(adjustVolumeBasedOnRecovery(10, 3, false, 5, 15)).toBe(10);
  });

  it('does not exceed maximum volume', () => {
    expect(adjustVolumeBasedOnRecovery(15, 5, false, 5, 15)).toBe(15);
  });

  it('does not go below minimum volume', () => {
    expect(adjustVolumeBasedOnRecovery(5, 1, false, 5, 15)).toBe(5);
  });
});
