
// Workout constants and configurations split out for clarity

export const workoutSplits = {
  beginner: {
    1: [['fullbody']],
    2: [['upper'], ['lower']],
    3: [['push'], ['pull'], ['legs']],
    4: [['chest', 'triceps'], ['back', 'biceps'], ['legs'], ['shoulders', 'core']],
    5: [['chest'], ['back'], ['legs'], ['shoulders'], ['arms', 'core']],
    6: [['push'], ['pull'], ['legs'], ['push'], ['pull'], ['legs']],
    7: [['chest'], ['back'], ['legs'], ['shoulders'], ['arms'], ['cardio'], ['rest']]
  },
  intermediate: {
    3: [['push'], ['pull'], ['legs']],
    4: [['chest', 'triceps'], ['back', 'biceps'], ['legs'], ['shoulders', 'core']],
    5: [['chest'], ['back'], ['legs'], ['shoulders'], ['arms', 'core']],
    6: [['push'], ['pull'], ['legs'], ['push'], ['pull'], ['legs']]
  },
  advanced: {
    4: [['chest', 'triceps'], ['back', 'biceps'], ['legs'], ['shoulders', 'core']],
    5: [['chest'], ['back'], ['legs'], ['shoulders'], ['arms', 'core']],
    6: [['push'], ['pull'], ['legs'], ['push'], ['pull'], ['legs']]
  }
};

export const workoutNames = {
  fullbody: 'Full Body Workout',
  upper: 'Upper Body Workout',
  lower: 'Lower Body Workout',
  push: 'Push Workout',
  pull: 'Pull Workout',
  legs: 'Leg Day',
  chest: 'Chest Focus',
  back: 'Back Attack',
  shoulders: 'Shoulder Sculpt',
  arms: 'Arm Blast',
  core: 'Core Crusher',
  'chest, triceps': 'Chest & Triceps',
  'back, biceps': 'Back & Biceps',
  'shoulders, core': 'Shoulders & Core',
  'arms, core': 'Arms & Core'
};

export const muscleGroupToWorkoutType: Record<string, string[]> = {
  chest: ['push', 'chest', 'upper', 'fullbody'],
  back: ['pull', 'back', 'upper', 'fullbody'],
  shoulders: ['push', 'shoulders', 'upper', 'fullbody'],
  biceps: ['pull', 'arms', 'upper', 'fullbody'],
  triceps: ['push', 'arms', 'upper', 'fullbody'],
  legs: ['legs', 'lower', 'fullbody'],
  quads: ['legs', 'lower', 'fullbody'],
  hamstrings: ['legs', 'lower', 'fullbody'],
  glutes: ['legs', 'lower', 'fullbody'],
  calves: ['legs', 'lower', 'fullbody'],
  core: ['core', 'fullbody']
};

// RP-based volume recommendations (sets per week)
export const volumeRecommendations = {
  minimum: {
    chest: 10,
    back: 10,
    shoulders: 8,
    biceps: 8,
    triceps: 8,
    legs: 12,
    quads: 8,
    hamstrings: 8,
    glutes: 8,
    calves: 8,
    core: 6
  },
  moderate: {
    chest: 14,
    back: 14,
    shoulders: 12,
    biceps: 12,
    triceps: 12,
    legs: 16,
    quads: 12,
    hamstrings: 12,
    glutes: 12,
    calves: 10,
    core: 8
  },
  maximum: {
    chest: 20,
    back: 20,
    shoulders: 16,
    biceps: 16,
    triceps: 16,
    legs: 20,
    quads: 16,
    hamstrings: 16,
    glutes: 16,
    calves: 12,
    core: 10
  }
};

export const maxExercisesPerSession = {
  beginner: 2,
  intermediate: 2,
  advanced: 3
};

export const setsPerExercise = {
  beginner: 3,
  intermediate: 4,
  advanced: 4
};

export const progressionSchema = {
  week1: 0.8,
  week2: 0.9,
  week3: 1.0,
  week4: 1.1,
  week5: 0.7
};

export const trainingGoalParams = {
  hypertrophy: {
    repMin: 8,
    repMax: 12,
    setsMultiplier: 1,
    restMinutes: 1.5,
    exerciseMultiplier: 1,
    rir: [3, 2, 1, 0],
    description: "Building muscle size with moderate weight and higher reps"
  },
  strength: {
    repMin: 3,
    repMax: 6,
    setsMultiplier: 1.2,
    restMinutes: 3,
    exerciseMultiplier: 0.8,
    rir: [2, 2, 1, 1],
    description: "Maximizing strength with heavier weights and lower reps"
  },
  maintenance: {
    repMin: 6,
    repMax: 10,
    setsMultiplier: 0.8,
    restMinutes: 2,
    exerciseMultiplier: 0.9,
    rir: [3, 3, 2, 2],
    description: "Maintaining current physique and performance"
  }
};

export const exercisePriority = {
  hypertrophy: ["isolation", "compound"],
  strength: ["compound", "isolation"],
  maintenance: ["compound", "isolation"]
};
