
export interface RecoveryFeedback {
  muscleGroup: string;
  rir?: number;
  pump: number;
  soreness: number;
  fatigue: number;
}

export interface VolumeLandmark {
  week: number;
  volume: {
    [muscleGroup: string]: number;
  };
}

export const DEFAULT_VOLUME_LANDMARKS: VolumeLandmark[] = [
  {
    week: 1,
    volume: {
      chest: 10,
      back: 10,
      shoulders: 10,
      biceps: 8,
      triceps: 8,
      quads: 10,
      hamstrings: 10,
      glutes: 10,
      calves: 8,
      core: 8
    }
  },
  {
    week: 4,
    volume: {
      chest: 12,
      back: 12,
      shoulders: 12,
      biceps: 10,
      triceps: 10,
      quads: 12,
      hamstrings: 12,
      glutes: 12,
      calves: 10,
      core: 10
    }
  },
  {
    week: 8,
    volume: {
      chest: 15,
      back: 15,
      shoulders: 15,
      biceps: 12,
      triceps: 12,
      quads: 15,
      hamstrings: 15,
      glutes: 15,
      calves: 12,
      core: 12
    }
  }
];
