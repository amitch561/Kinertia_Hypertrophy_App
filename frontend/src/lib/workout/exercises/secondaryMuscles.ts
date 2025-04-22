
// Map of exercises with their secondary muscle impacts
export const secondaryMuscleMap: Record<string, string[]> = {
  // Chest movements impact front delts
  "incline_dumbbell_press": ["shoulders"],
  "incline_barbell_bench_press": ["shoulders"],
  "flat_dumbbell_bench_press": ["shoulders"],
  "flat_barbell_bench_press": ["shoulders"],
  "decline_bench_press": ["shoulders"],
  "dumbbell_flyes": ["shoulders"],
};

// Helper function to determine if an exercise ID is a pressing movement
export const isPressingMovement = (exerciseId: string): boolean => {
  // Chest pressing movements that train anterior delts
  const pressingMovements = [
    "incline_dumbbell_press",
    "incline_barbell_bench_press",
    "flat_dumbbell_bench_press",
    "flat_barbell_bench_press",
    "decline_bench_press",
    "dumbbell_flyes",
    // Add other pressing exercises that work front delts
    "shoulder_press",
    "overhead_press",
    "military_press",
    "push_press",
    "chest_press_machine"
  ];
  
  return pressingMovements.includes(exerciseId);
};
