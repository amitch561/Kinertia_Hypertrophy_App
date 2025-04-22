
// Research-backed exercise recommendations for beginners focusing on minimum effective volume
export const recommendedExercises = {
  chest: ['flat_barbell_bench_press', 'incline_dumbbell_bench_press'], // Bench Press variants
  back: ['pull_ups', 'bent_over_row', 'lat_pulldown'], // Pull-ups and Rows
  shoulders: ['overhead_press', 'lateral_raise'], // Overhead Press and Lateral Raises
  biceps: ['barbell_curl', 'dumbbell_curl'], // Basic Barbell/Dumbbell Curls
  triceps: ['tricep_pushdown', 'close_grip_bench_press'], // Pushdowns and Close Grip Bench
  quads: ['barbell_squat', 'leg_press'], // Squats and Leg Press
  hamstrings: ['romanian_deadlift', 'leg_curl'], // Romanian Deadlifts and Leg Curls
  glutes: ['hip_thrust', 'glute_bridge'], // Hip Thrusts and Glute Bridges
  calves: ['standing_calf_raise', 'seated_calf_raise'], // Standing and Seated Calf Raises
  core: ['plank', 'ab_wheel_rollout'] // Planks and Ab Wheel
};

export const getRecommendedExercises = (muscleGroup: string, volumeLevel: 'minimum' | 'moderate' | 'maximum'): string[] => {
  if (volumeLevel === 'minimum') {
    return recommendedExercises[muscleGroup as keyof typeof recommendedExercises] || [];
  }
  return [];
};
