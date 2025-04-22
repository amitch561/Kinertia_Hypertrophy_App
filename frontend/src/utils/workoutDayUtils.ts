
export const splitMuscleGroups: Record<string, string[]> = {
  push: ["chest", "shoulders", "triceps"],
  pull: ["back", "biceps"],
  legs: ["quads", "hamstrings", "glutes", "calves"],
  upper: ["chest", "back", "shoulders", "biceps", "triceps"],
  lower: ["quads", "hamstrings", "glutes", "calves"],
  fullbody: ["chest", "back", "shoulders", "biceps", "triceps", "quads", "hamstrings", "glutes", "calves"],
};

export const dayNames: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday"
};

export const getSplitForDay = (index: number, splitType: string, selectedDays: string[]) => {
  const dayIndex = index % selectedDays.length;
  
  if (splitType === "push_pull_legs") {
    const ppls = ["push", "pull", "legs"];
    return ppls[dayIndex % ppls.length];
  } else if (splitType === "upper_lower") {
    return dayIndex % 2 === 0 ? "upper" : "lower";
  } else if (splitType === "full_body") {
    return "fullbody";
  } else {
    return Object.keys(splitMuscleGroups)[dayIndex % Object.keys(splitMuscleGroups).length];
  }
};

export const getSplitDisplayName = (split: string) => {
  const displayNames: Record<string, string> = {
    push: "Push Day",
    pull: "Pull Day",
    legs: "Leg Day",
    upper: "Upper Body",
    lower: "Lower Body",
    fullbody: "Full Body"
  };
  return displayNames[split] || split;
};

export const getPushDaySequence = (index: number, split: string, selectedDays: string[]) => {
  if (split.toLowerCase() !== 'push') return undefined;
  
  let sequence = 1;
  for (let i = 0; i < index; i++) {
    if (getSplitForDay(i, 'push_pull_legs', selectedDays) === 'push') sequence++;
  }
  return sequence;
};

export const getPushDaysCount = (selectedDays: string[], splitType: string) => {
  let count = 0;
  for (let i = 0; i < selectedDays.length; i++) {
    if (getSplitForDay(i, splitType, selectedDays) === 'push') count++;
  }
  return count;
};
